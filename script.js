document.addEventListener("DOMContentLoaded", function () {
  // Data can be fetched from an API. For this demo, it's hardcoded.

  const tableBody = document.getElementById("userDataBody");
  const users = responseData.users;

  const modal = document.getElementById("userModal");
  const modalContent = modal.querySelector(".modal-content");
  const closeModalBtn = modal.querySelector(".close-btn");
  const documentDisplay = document.getElementById("documentDisplay");
  const docButtonsContainer = modal.querySelector(".doc-buttons");
  const eventFilter = document.getElementById("eventFilter");

  // --- Renders or re-renders the table rows ---
  const renderTable = (userList) => {
    tableBody.innerHTML = ""; // Clear existing rows
    userList.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                        <td>${user.userName}</td>
                        <td>${user.eventChoice}</td>
                        <td><button class="details-btn" data-userid="${user.userId}">View Details</button></td>
                    `;
      tableBody.appendChild(row);
    });
  };

  // --- Populates the filter dropdown with unique values ---
  const populateFilter = () => {
    const uniqueEvents = [...new Set(users.map((user) => user.eventChoice))];
    eventFilter.innerHTML = '<option value="">All Events</option>'; // Start with the "All" option
    uniqueEvents.sort().forEach((event) => {
      const option = document.createElement("option");
      option.value = event;
      option.textContent = event;
      eventFilter.appendChild(option);
    });
  };

  // --- Filters the table based on dropdown selection ---
  const filterTable = () => {
    const selectedEvent = eventFilter.value;
    if (selectedEvent) {
      const filteredUsers = users.filter(
        (user) => user.eventChoice === selectedEvent
      );
      renderTable(filteredUsers);
    } else {
      renderTable(users); // Show all if "All Events" is selected
    }
  };

  // --- Modal Logic ---
  const openModal = (userId) => {
    const user = users.find((u) => u.userId === userId);
    if (!user) return;

    const formattedIncome = user.yearlyIncome.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });

    document.getElementById("modalUserName").textContent = user.userName;
    document.getElementById("modalAge").textContent = user.age;
    document.getElementById("modalIncome").textContent = formattedIncome;
    document.getElementById("modalEmail").textContent = user.emailAddress;
    document.getElementById("modalPhone").textContent = user.userPhoneNumber;
    document.getElementById("modalEducation").textContent =
      user.highestLevelOfEducation;
    document.getElementById("modalSex").textContent = user.sex;

    modalContent.dataset.currentUserId = userId;
    documentDisplay.textContent = "Select a document to view its content.";
    docButtonsContainer
      .querySelectorAll(".doc-btn")
      .forEach((btn) => btn.classList.remove("active"));

    modal.style.display = "block";
  };

  // --- Event Listeners ---
  eventFilter.addEventListener("change", filterTable);

  modalContent.addEventListener("click", (event) => {
    if (event.target.classList.contains("doc-btn")) {
      const docType = event.target.dataset.docType;
      const userId = modalContent.dataset.currentUserId;
      const user = users.find((u) => u.userId === userId);

      if (user && user.documents && user.documents[docType]) {
        documentDisplay.textContent = user.documents[docType];
        docButtonsContainer
          .querySelectorAll(".doc-btn")
          .forEach((btn) => btn.classList.remove("active"));
        event.target.classList.add("active");
      }
    }
  });

  tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("details-btn")) {
      const userId = event.target.getAttribute("data-userid");
      openModal(userId);
    }
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // --- Initial Setup ---
  populateFilter(); // Create the dropdown options
  renderTable(users); // Initial population of the table
});
