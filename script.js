const pets = [
  {
    id: 1,
    name: "Nova",
    type: "Dog",
    age: "Puppy",
    size: "Medium",
    energy: "Playful",
    city: "Brooklyn, NY",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    bio: "Nova is a bouncy bundle of joy who loves long walks, squeaky toys, and every person she meets.",
    tags: ["Friendly", "Walks", "Apartment-ready"],
    featured: true,
    story: "Matched with a couple who wanted a sociable dog for weekend hikes and family dinners."
  },
  {
    id: 2,
    name: "Mochi",
    type: "Cat",
    age: "Young",
    size: "Small",
    energy: "Affectionate",
    city: "Austin, TX",
    image:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80",
    bio: "Mochi is gentle, talkative, and happiest curled up on a soft blanket beside her favorite humans.",
    tags: ["Lap cat", "Indoor", "Calm"],
    featured: false,
    story: "Settled perfectly in a quiet home with a retired couple who wanted a peaceful companion."
  },
  {
    id: 3,
    name: "Pip",
    type: "Rabbit",
    age: "Adult",
    size: "Small",
    energy: "Calm",
    city: "Seattle, WA",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=80",
    bio: "Pip enjoys quiet enrichment, fresh greens, and a peaceful routine with gentle pets and lots of attention.",
    tags: ["Gentle", "Sweet", "Low-maintenance"],
    featured: false,
    story: "Moved into a home with a cozy sunroom and a family that loved calm, curious pets."
  },
  {
    id: 4,
    name: "Maple",
    type: "Dog",
    age: "Adult",
    size: "Large",
    energy: "Calm",
    city: "Denver, CO",
    image:
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80",
    bio: "Maple has a mellow disposition and a loyal heart, making her a wonderful companion for active families.",
    tags: ["Smart", "Leash trained", "Family-friendly"],
    featured: true,
    story: "Found her dream home with parents and kids who loved outdoor adventures and steady company."
  },
  {
    id: 5,
    name: "Luna",
    type: "Cat",
    age: "Puppy",
    size: "Small",
    energy: "Playful",
    city: "Portland, OR",
    image:
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=80",
    bio: "Luna is curious, silly, and always ready for a chase game or a sunbeam nap in the windowsill.",
    tags: ["Curious", "Toy-lover", "Social"],
    featured: false,
    story: "Adopted by a first-time pet parent who wanted a playful kitten and a gentle teacher."
  },
  {
    id: 6,
    name: "Otis",
    type: "Dog",
    age: "Young",
    size: "Medium",
    energy: "Affectionate",
    city: "Chicago, IL",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    bio: "Otis thrives on attention and companionship, making him a perfect match for busy homes with lots of love.",
    tags: ["People-loving", "Training", "Happy-go-lucky"],
    featured: false,
    story: "Bonded instantly with a family who worked from home and wanted a constant cheerful companion."
  }
];

const storyShowcase = [
  {
    name: "Milo",
    story: "Adopted by a couple after two quick matches and one perfect meet-and-greet.",
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Pepper",
    story: "Found her forever home with a family that loved calm routines and cozy evenings.",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Clover",
    story: "A gentle rabbit rescued and matched to a peaceful apartment with a sunny window.",
    image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=900&q=80"
  }
];

const state = {
  currentIndex: 0,
  filter: {
    type: "all",
    age: "all",
    energy: "all"
  },
  activePet: null,
  liked: 0,
  skipped: 0,
  superliked: 0
};

const stackEl = document.querySelector("#pet-card-stack");
const matchCountEl = document.querySelector("#match-count");
const storyGridEl = document.querySelector("#story-grid");
const modal = document.querySelector("#pet-modal");
const modalContent = document.querySelector("#modal-content");

function visiblePets() {
  return pets.filter((pet) => {
    const matchesType = state.filter.type === "all" || pet.type === state.filter.type;
    const matchesAge = state.filter.age === "all" || pet.age === state.filter.age;
    const matchesEnergy = state.filter.energy === "all" || pet.energy === state.filter.energy;
    return matchesType && matchesAge && matchesEnergy;
  });
}

function renderStoryGrid() {
  storyGridEl.innerHTML = storyShowcase
    .map(
      (story) => `
        <article class="story-card">
          <img src="${story.image}" alt="${story.name}" />
          <div class="story-card-body">
            <h4>${story.name}</h4>
            <p>${story.story}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCards() {
  const filtered = visiblePets();
  matchCountEl.textContent = `${filtered.length} pets available`;

  if (filtered.length === 0) {
    stackEl.innerHTML = `
      <div class="pet-card">
        <div class="pet-card-content">
          <h3>No matches yet</h3>
          <p class="pet-story">Try widening your filters to discover more adorable companions.</p>
        </div>
      </div>
    `;
    return;
  }

  state.currentIndex = Math.min(state.currentIndex, filtered.length - 1);
  const visibleCards = filtered.slice(state.currentIndex, state.currentIndex + 3);

  stackEl.innerHTML = visibleCards
    .map(
      (pet, idx) => `
        <article class="pet-card ${idx === 0 ? "active" : ""}" data-id="${pet.id}" data-index="${idx}">
          <img src="${pet.image}" alt="${pet.name}" />
          <div class="pet-card-content">
            <div class="pet-topline">
              <h3 class="pet-name">${pet.name}</h3>
              <button class="primary-btn" data-open-detail="${pet.id}">Details</button>
            </div>

            <div class="pet-meta">
              <span>${pet.type}</span>
              <span>•</span>
              <span>${pet.age}</span>
              <span>•</span>
              <span>${pet.city}</span>
            </div>

            <div class="pet-badges">
              ${pet.tags.map((tag) => `<span class="pet-badge">${tag}</span>`).join("")}
            </div>

            <p class="pet-story">${pet.bio}</p>
          </div>
        </article>
      `
    )
    .join("");

  attachDetailButtons();
}

function attachDetailButtons() {
  document.querySelectorAll("[data-open-detail]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const petId = Number(event.currentTarget.dataset.openDetail);
      openModal(petId);
    });
  });
}

function openModal(petId) {
  const pet = pets.find((entry) => entry.id === pId);
  if (!pet) return;

  state.activePet = pet;
  modalContent.innerHTML = `
    <img src="${pet.image}" alt="${pet.name}" />
    <div class="modal-text">
      <h3>${pet.name}</h3>
      <div class="muted">${pet.type} • ${pet.age} • ${pet.city}</div>
      <div class="detail-row">
        ${pet.tags.map((tag) => `<span class="detail-tag">${tag}</span>`).join("")}
      </div>
      <p>${pet.bio}</p>
      <p><strong>Story:</strong> ${pet.story}</p>
      <div class="modal-actions">
        <button class="secondary-btn" id="modal-skip">Maybe later</button>
        <button class="primary-btn" id="modal-adopt">Adopt now</button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  document.querySelector("#modal-skip").addEventListener("click", () => closeModal());
  document.querySelector("#modal-adopt").addEventListener("click", () => {
    state.liked += 1;
    closeModal();
    advanceMatch();
  });
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function advanceMatch() {
  const filtered = visiblePets();
  if (filtered.length <= 1) {
    state.currentIndex = 0;
    renderCards();
    return;
  }

  state.currentIndex += 1;
  renderCards();
}

function handleDecision(action) {
  const filtered = visiblePets();
  if (!filtered.length) return;

  const pet = filtered[state.currentIndex];
  if (!pet) return;

  if (action === "like") {
    state.liked += 1;
  } else if (action === "favorite") {
    state.superliked += 1;
  } else {
    state.skipped += 1;
  }

  advanceMatch();
}

function bindFilters() {
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const group = chip.parentElement.dataset.filterGroup;
      const value = chip.dataset.value;

      state.filter[group] = value;
      document.querySelectorAll(`[data-filter-group="${group}"] .chip`).forEach((button) => {
        button.classList.toggle("active", button === chip);
      });

      state.currentIndex = 0;
      renderCards();
    });
  });
}

function bindActions() {
  document.querySelector("#skip-btn").addEventListener("click", () => handleDecision("skip"));
  document.querySelector("#superlike-btn").addEventListener("click", () => handleDecision("favorite"));
  document.querySelector("#like-btn").addEventListener("click", () => handleDecision("like"));
  document.querySelector("#close-modal").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

function init() {
  renderStoryGrid();
  renderCards();
  bindFilters();
  bindActions();
}

init();
