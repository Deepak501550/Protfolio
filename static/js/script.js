// simple helpers
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

// modal elements
const modal = $("#modal");
const modalTitle = $("#modal-title");
const modalBody = $("#modal-body");
const modalClose = $("#modal-close");
modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

// parallax translate on scroll
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  $$(".scroll-animate").forEach(el => {
    const speed = parseFloat(el.dataset.speed || "0.12");
    el.style.transform = `translateY(${y * speed}px)`;
  });
});

// fetch resume data from Flask endpoint
fetch("/api/data")
  .then(r => {
    if (!r.ok) throw new Error("Failed to fetch data");
    return r.json();
  })
  .then(data => {
    // header
    $("#profile-pic").src = data.profile_pic || "/static/images/deepakkumar.jpg";
    // typed name
    if (typeof Typed !== "undefined") {
      new Typed("#typed-name", {
        strings: [data.name || "Your Name"],
        typeSpeed: 60,
        backSpeed: 30,
        loop: true,
        backDelay: 2200
      });
    } else {
      $("#typed-name").textContent = data.name || "";
    }
    $("#role").textContent = data.title || "";
    $("#year").textContent = new Date().getFullYear();

    // contact
    const contact = $("#contact");
    const contactParts = [];
    if (data.contact?.phone) contactParts.push(`<span>${data.contact.phone}</span>`);
    if (data.contact?.email) contactParts.push(`<a href="mailto:${data.contact.email}">${data.contact.email}</a>`);
    if (data.contact?.location) contactParts.push(`<span>${data.contact.location}</span>`);
    if (data.contact?.linkedin) contactParts.push(`<a href="${data.contact.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>`);
    contact.innerHTML = contactParts.join("");

    // about
    $("#about-text").textContent = data.about || "";

    // skills
    const skillsGrid = $("#skills-grid");
    (data.skills || []).forEach(skill => {
      const btn = document.createElement("button");
      btn.className = "card";
      btn.type = "button";
      btn.innerHTML = `<div class="title">${skill.name}</div><div class="meta">Click for details</div>`;
      btn.addEventListener("click", () => {
        modalTitle.textContent = skill.name;
        modalBody.textContent = skill.details || "";
        modal.classList.remove("hidden");
      });
      skillsGrid.appendChild(btn);
    });

    // experience
    const expList = $("#exp-list");
    (data.experience || []).forEach(e => {
      const div = document.createElement("div");
      div.className = "entry card";
      div.innerHTML = `<h3>${e.role} — ${e.company}</h3>
                       <div class="year">${e.year || ""}</div>
                       <ul>${(e.details||[]).map(it => `<li>${it}</li>`).join("")}</ul>`;
      expList.appendChild(div);
    });

    // projects
    const projGrid = $("#proj-grid");
    (data.projects || []).forEach(p => {
      const c = document.createElement("div");
      c.className = "card";
      c.innerHTML = `<div class="title">${p.name}</div>
                     <div>${p.description}</div>
                     <small>Tech: ${(p.tech||[]).join(", ")}</small>`;
      projGrid.appendChild(c);
    });

    // certificates
    const certList = $("#cert-list");
    (data.certificates || []).forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${c.name}</strong> — ${c.issuer || ""} (${c.year || ""})<br>${c.details || ""}`;
      certList.appendChild(li);
    });

    // education
    const eduList = $("#edu-list");
    (data.education || []).forEach(ed => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<div><strong>${ed.degree}</strong> — ${ed.school}</div>
                        <div class="meta">${ed.year || ""}</div>
                        ${ed.gpa ? `<div class="meta">GPA: ${ed.gpa}</div>` : ""}`;
      eduList.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    alert("Failed to load profile data. Check console for details.");
  });
