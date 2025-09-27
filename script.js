const pincodeInput = document.getElementById("pincodeInput");
const filterInput = document.getElementById("filterInput");
const statusDiv = document.getElementById("status");
const resultsDiv = document.getElementById("results");

let postOffices = [];

function validatePincode(pin) {
  return /^[0-9]{6}$/.test(pin);
}

async function lookupPincode() {
  const pin = pincodeInput.value.trim();
  resultsDiv.innerHTML = "";
  statusDiv.innerHTML = "";
  postOffices = [];

  if (!validatePincode(pin)) {
    statusDiv.innerHTML = "<div class='error'>Pincode should be of 6 digits</div>";
    return;
  }

  statusDiv.innerHTML = <div class="loader">Fetching postal data...</div>;

  try {
    const res = await fetch(https://api.postalpincode.in/pincode/${pin});
    const data = await res.json();
    const payload = data[0];

    if (payload.Status !== "Success" || !payload.PostOffice) {
      statusDiv.innerHTML = "<div class='error'>Couldn't fetch postal data you're looking for...</div>";
      return;
    }

    postOffices = payload.PostOffice;
    filterInput.disabled = false;
    filterInput.value = "";
    statusDiv.innerHTML = Showing ${postOffices.length} post offices;
    renderResults();
  } catch (err) {
    statusDiv.innerHTML = "<div class='error'>Couldn't fetch postal data you're looking for...</div>";
  }
}

function renderResults() {
  const filterText = filterInput.value.trim().toLowerCase();
  const filtered = postOffices.filter(po =>
    po.Name.toLowerCase().includes(filterText)
  );

  resultsDiv.innerHTML = "";

  if (filtered.length === 0 && postOffices.length > 0) {
    resultsDiv.innerHTML = "<div>No post offices match that filter.</div>";
    return;
  }

  filtered.forEach(po => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${po.Name}</h3>
      <p><strong>Branch Type:</strong> ${po.BranchType}</p>
      <p><strong>Pincode:</strong> ${po.Pincode}</p>
      <p><strong>District:</strong> ${po.District}</p>
      <p><strong>State:</strong> ${po.State}</p>
    `;
    resultsDiv.appendChild(card);
  });
}
