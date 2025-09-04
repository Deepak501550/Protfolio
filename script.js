// Helper selectors
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

// Modal setup
const modal = $("#modal");
const modalTitle = $("#modal-title");
const modalBody = $("#modal-body");
const modalClose = $("#modal-close");
modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

// Parallax animation
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  $$(".scroll-animate").forEach(el => {
    const speed = parseFloat(el.dataset.speed || "0.15");
    el.style.transform = `translateY(${y * speed}px)`;
  });
});

// Load profile data
fetch("data.json")
  .then(r => r.json())
  .then(data => {
    // Hero
    $("#profile-pic").src = data.profile_pic;
    new Typed("#typed-name", {
      strings: [data.name],
      typeSpeed: 60, backSpeed: 30, loop: true, backDelay: 2200
    });
    $("#role").textContent = data.title;
    $("#year").textContent = new Date().getFullYear();

    // Contact
    const contact = $("#contact");
    const contactBits = [];
    if (data.contact?.phone) contactBits.push(`<span>${data.contact.phone}</span>`);
    if (data.contact?.email) contactBits.push(`<a href="mailto:${data.contact.email}">${data.contact.email}</a>`);
    if (data.contact?.location) contactBits.push(`<span>${data.contact.location}</span>`);
    if (data.contact?.linkedin) contactBits.push(`<a href="${data.contact.linkedin}" target="_blank">LinkedIn</a>`);
    contact.innerHTML = contactBits.join(" | ");

    // About
    $("#about-text").textContent = data.about;

    // Skills (clickable cards)
    const sg = $("#skills-grid");
    data.skills.forEach(skill => {
      const div = document.createElement("button");
      div.className = "card";
      div.type = "button";
      div.innerHTML = `<div class="title">${skill.name}</div><div class="meta">Click for details</div>`;
      div.addEventListener("click", () => {
        modalTitle.textContent = skill.name;
        modalBody.textContent = skill.details;
        modal.classList.remove("hidden");
      });
      sg.appendChild(div);
    });

    // Experience (clickable cards)
    const exp = $("#exp-list");
    data.experience.forEach(e => {
      const div = document.createElement("button");
      div.className = "card";
      div.type = "button";
      div.innerHTML = `<div class="title">${e.role} — ${e.company}</div><div class="meta">Click for details</div>`;
      div.addEventListener("click", () => {
        modalTitle.textContent = `${e.role} — ${e.company}`;
        modalBody.innerHTML =
          `<div class="year">${e.year}</div>
           <ul>${(e.details||[]).map(li=>`<li>${li}</li>`).join("")}</ul>`;
        modal.classList.remove("hidden");
      });
      exp.appendChild(div);
    });

    // Projects (clickable cards, FIXED)
    const pg = $("#proj-grid");
    data.projects.forEach(p => {
      const div = document.createElement("button");
      div.className = "card";
      div.type = "button";
      div.innerHTML = `<div class="title">${p.name}</div><div class="meta">Click for details</div>`;
      div.addEventListener("click", () => {
        modalTitle.textContent = p.name;
        modalBody.innerHTML = `
          <p>${p.description}</p>
          <p><strong>Tech:</strong> ${(p.tech||[]).join(", ")}</p>
          ${p.image ? `<img src="${p.image}" alt="${p.name}" style="max-width:100%;margin-top:1rem;border-radius:8px;">` : ""}
        `;
        modal.classList.remove("hidden");
      });
      pg.appendChild(div);
    });

    // Certificates (simple list)
    const cl = $("#cert-list");
    (data.certificates||[]).forEach(cer => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${cer.name}</strong> — ${cer.issuer} (${cer.year})<br>${cer.details||""}`;
      cl.appendChild(li);
    });

    // Education
    const edu = $("#edu-list");
    data.education.forEach(ed => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        `<div class="row">
            <div><strong>${ed.degree}</strong> — ${ed.school}</div>
            <div class="meta">${ed.year}</div>
         </div>
         ${ed.gpa ? `<div class="meta">GPA: ${ed.gpa}</div>` : ""}`;
      edu.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Failed to load data.json", err);
    alert("Couldn't load profile data. Make sure data.json is in the same folder as index.html.");
  });
