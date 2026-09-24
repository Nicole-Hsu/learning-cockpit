export function parseTSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else { field += c; }
    } else if (c === '"' && field === '') {
      inQuotes = true;
    } else if (c === '\t') {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function csvCell(v) {
  let s = String(v == null ? '' : v);
  if (/^[=@]/.test(s)) s = ' ' + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

export function buildExportCsv(banks) {
  const rows = [['單元', '限時(秒)', '題目', 'A', 'B', 'C', 'D', '正解(A~D)', '圖片網址(多張用空格隔開)']];
  banks.forEach(b => {
    (b.subQuestions || []).forEach((sq, i) => {
      const imgs = (sq.imageUrls && sq.imageUrls.length) ? sq.imageUrls : (sq.imageUrl ? [sq.imageUrl] : []);
      rows.push([
        i === 0 ? b.title : '', i === 0 ? b.timeLimitSeconds : '',
        sq.content, sq.options[0], sq.options[1], sq.options[2], sq.options[3],
        sq.correctAnswer, imgs.join(' ')
      ]);
    });
  });
  return '﻿' + rows.map(r => r.map(csvCell).join(',')).join('\r\n');
}

function normalizeAnswer(s) {
  return s.replace(/[Ａ-Ｄａ-ｄ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)).toUpperCase();
}

export function buildImportBanks(rows, defaultLimit = 300) {
  const errors = [];
  const banks = [];
  const byTitle = new Map();
  let start = 0;
  if (rows.length && /^(單元|大題標題)/.test((rows[0][0] || '').trim())) start = 1;
  let curTitle = '';

  for (let i = start; i < rows.length; i++) {
    const r = rows[i].map(s => (s || '').trim());
    if (r.every(s => !s)) continue;
    const no = i + 1;
    const title = r[0], limit = r[1], content = r[2];
    const opts = [r[3], r[4], r[5], r[6]];
    const correct = normalizeAnswer(r[7] || '');
    const imgText = r[8] || '';
    const rowErrors = [];

    if (title) curTitle = title;
    if (!curTitle) { errors.push('第 ' + no + ' 列：沒有單元名稱（第一個小題那一列一定要填「單元」）'); continue; }

    let bank = byTitle.get(curTitle);
    if (!bank) {
      bank = { title: curTitle, timeLimitSeconds: null, subQuestions: [] };
      byTitle.set(curTitle, bank);
      banks.push(bank);
    }

    if (limit) {
      if (!/^\d+$/.test(limit) || parseInt(limit, 10) < 10) {
        rowErrors.push('限時要是至少 10 的整數秒數（目前是「' + limit + '」）');
      } else if (bank.timeLimitSeconds == null) {
        bank.timeLimitSeconds = parseInt(limit, 10);
      }
    }
    if (!content) rowErrors.push('沒有題目內容');
    const missing = ['A', 'B', 'C', 'D'].filter((_, k) => !opts[k]);
    if (missing.length) rowErrors.push('選項 ' + missing.join('、') + ' 是空的（A~D 四個都要填）');
    if (!/^[ABCD]$/.test(correct)) rowErrors.push('正解要填 A、B、C 或 D（目前是「' + (r[7] || '') + '」）');

    const imageUrls = imgText.split(/[\s,，、]+/).filter(Boolean);
    const badImg = imageUrls.filter(u => !/^https?:\/\//i.test(u));
    if (badImg.length) rowErrors.push('圖片網址要以 http:// 或 https:// 開頭（有問題的：' + badImg[0] + '）');

    if (rowErrors.length) {
      rowErrors.forEach(m => errors.push('第 ' + no + ' 列：' + m));
      continue;
    }
    bank.subQuestions.push({
      order: bank.subQuestions.length + 1,
      content, imageUrls, options: opts, correctAnswer: correct
    });
  }

  const valid = banks.filter(b => b.subQuestions.length > 0);
  valid.forEach(b => { if (b.timeLimitSeconds == null) b.timeLimitSeconds = defaultLimit; });
  return { banks: valid, errors };
}
