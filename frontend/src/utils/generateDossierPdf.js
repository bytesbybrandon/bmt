import { jsPDF } from "jspdf";
import {
  PROFILE,
  ABOUT,
  EDUCATION,
  TIMELINE,
  PROJECTS,
  SKILLS,
  SOCIALS,
} from "@/data/content";

const BG = [7, 9, 13];
const AMBER = [244, 178, 102];
const SILVER = [226, 232, 240];
const DIM = [126, 136, 150];
const FAINT = [72, 80, 94];

export function downloadDossier() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  const CW = W - M * 2;
  let y = 0;

  const paintPage = () => {
    doc.setFillColor(...BG);
    doc.rect(0, 0, W, H, "F");
  };

  const footer = (pageNum) => {
    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...FAINT);
    doc.text(`${PROFILE.website}  ·  ${pageNum}`, W / 2, H - 28, {
      align: "center",
      charSpace: 1.5,
    });
  };

  paintPage();
  let pageNum = 1;
  y = 78;

  const ensure = (need) => {
    if (y + need > H - 70) {
      footer(pageNum);
      doc.addPage();
      pageNum += 1;
      paintPage();
      y = 64;
    }
  };

  const section = (title) => {
    ensure(64);
    y += 20;
    doc.setFont("courier", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...AMBER);
    doc.text(title.toUpperCase(), M, y, { charSpace: 3 });
    y += 8;
    doc.setDrawColor(...FAINT);
    doc.setLineWidth(0.5);
    doc.line(M, y, W - M, y);
    y += 18;
  };

  const body = (text, size = 9.5, color = SILVER, font = "helvetica") => {
    doc.setFont(font, "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CW);
    ensure(lines.length * size * 1.4 + 6);
    doc.text(lines, M, y, { lineHeightFactor: 1.4 });
    y += lines.length * size * 1.4 + 6;
  };

  // Header
  doc.setFont("times", "normal");
  doc.setFontSize(26);
  doc.setTextColor(...SILVER);
  doc.text(PROFILE.name, M, y);
  y += 10;
  doc.setDrawColor(...AMBER);
  doc.setLineWidth(1);
  doc.line(M, y, M + 120, y);
  y += 18;
  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...AMBER);
  doc.text(PROFILE.role.toUpperCase(), M, y, { charSpace: 2.5 });
  y += 14;
  doc.setTextColor(...DIM);
  doc.text(
    `${PROFILE.location}  ·  ${SOCIALS.find((s) => s.id === "email").handle}  ·  ${PROFILE.website}`,
    M,
    y,
    { charSpace: 1 }
  );
  y += 6;

  section("Entomology of an Engineer");
  ABOUT.paragraphs.forEach((p) => body(p));

  section("Silk Timeline");
  TIMELINE.forEach((item) => {
    ensure(78);
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...AMBER);
    doc.text(item.tenure.toUpperCase(), M, y, { charSpace: 1.5 });
    y += 15;
    doc.setFont("times", "normal");
    doc.setFontSize(13);
    doc.setTextColor(...SILVER);
    doc.text(item.role, M, y);
    y += 13;
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...DIM);
    doc.text(item.company.toUpperCase(), M, y, { charSpace: 1.5 });
    y += 13;
    body(item.impact, 9.5, SILVER);
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...DIM);
    doc.text(item.stack.join("  ·  "), M, y);
    y += 16;
  });

  ensure(40);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...SILVER);
  doc.text(`${EDUCATION.degree}, ${EDUCATION.school}`, M, y);
  y += 12;
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...DIM);
  doc.text(`${EDUCATION.years}  ·  ${EDUCATION.note}`, M, y, {
    charSpace: 0.5,
  });
  y += 10;

  section("Selected Works");
  PROJECTS.forEach((p) => {
    ensure(72);
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...SILVER);
    doc.text(`${p.index}.  ${p.title}`, M, y);
    const meta = `${p.category.toUpperCase()}  ·  ${p.year}`;
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...DIM);
    doc.text(meta, W - M, y, { align: "right", charSpace: 1 });
    y += 14;
    body(p.summary, 9.5, SILVER);
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...AMBER);
    doc.text(p.metrics.join("  ·  "), M, y, { charSpace: 0.5 });
    y += 16;
  });

  section("The Arsenal");
  SKILLS.forEach((group) => {
    ensure(30 + group.items.length * 18);
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...AMBER);
    doc.text(group.group.toUpperCase(), M, y, { charSpace: 2 });
    y += 14;
    group.items.forEach((skill) => {
      ensure(20);
      doc.setFont("courier", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...SILVER);
      doc.text(skill.name, M, y);
      doc.setTextColor(...DIM);
      doc.text(String(skill.level), W - M, y, { align: "right" });
      y += 6;
      doc.setFillColor(...FAINT);
      doc.rect(M, y, CW, 1.2, "F");
      doc.setFillColor(...AMBER);
      doc.rect(M, y, (CW * skill.level) / 100, 1.2, "F");
      y += 12;
    });
    y += 4;
  });

  section("Signals");
  SOCIALS.forEach((s) => {
    ensure(22);
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...AMBER);
    doc.text(s.label.toUpperCase(), M, y, { charSpace: 2 });
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...SILVER);
    doc.text(s.handle, M + 110, y);
    y += 20;
  });
  y += 6;
  body(`${PROFILE.availability}. ${PROFILE.location}.`, 9, DIM, "courier");

  footer(pageNum);
  doc.save("brandon-phillips-dossier.pdf");
}
