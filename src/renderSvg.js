function monthShort(month) {
  return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][month - 1];
}

function colorForType(type) {
  if (type === "menstruation") return "#F9A8D4";
  if (type === "fertile") return "#86EFAC";
  if (type === "ovulation") return "#93C5FD";
  return "#FFFFFF";
}

function badgeForType(type) {
  if (type === "menstruation") return "Menstruación";
  if (type === "fertile") return "Fértil";
  if (type === "ovulation") return "Ovulación";
  return "";
}

function renderCycleSvg(data) {
  const cellW = 88;
  const cellH = 70;
  const cols = 7;
  const rows = 6;
  const headerH = 90;
  const width = cols * cellW + 40;
  const height = headerH + rows * cellH + 40;
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  let svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#FFFDFB"/>
    <text x="20" y="32" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#111827">
      Calendario estimado del ciclo
    </text>
    <text x="20" y="56" font-family="Arial, sans-serif" font-size="12" fill="#4B5563">
      Rosa = menstruación · Verde = días fértiles · Azul = ovulación
    </text>
  `;

  for (let c = 0; c < cols; c++) {
    const x = 20 + c * cellW;
    svg += `
      <text x="${x + cellW / 2}" y="84" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#374151">
        ${dayNames[c]}
      </text>
    `;
  }

  data.days.forEach((item, i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    const x = 20 + col * cellW;
    const y = headerH + row * cellH;
    const fill = colorForType(item.type);
    const badge = badgeForType(item.type);
    const monthLabel = item.day === 1 ? monthShort(item.month) : "";

    svg += `
      <rect x="${x}" y="${y}" width="${cellW - 4}" height="${cellH - 4}" rx="12"
        fill="${fill}" stroke="#E5E7EB" stroke-width="1"/>
      <text x="${x + 14}" y="${y + 24}"
        font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#111827">
        ${item.day}
      </text>
    `;

    if (monthLabel) {
      svg += `
        <text x="${x + 14}" y="${y + 42}"
          font-family="Arial, sans-serif" font-size="11" fill="#6B7280">
          ${monthLabel}
        </text>
      `;
    }

    if (badge) {
      svg += `
        <text x="${x + 14}" y="${y + 60}"
          font-family="Arial, sans-serif" font-size="10" fill="#374151">
          ${badge}
        </text>
      `;
    }
  });

  svg += `</svg>`;
  return svg;
}

module.exports = {
  renderCycleSvg,
};
