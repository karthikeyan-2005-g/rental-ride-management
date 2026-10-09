const userId = localStorage.getItem("user_id");

const API_URL = "http://127.0.0.1:8000/api/cars/";

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const priceFilter = document.getElementById("priceFilter");

const carContainer = document.getElementById("carContainer");
const carCount = document.getElementById("carCount");
const noResults = document.getElementById("noResults");

let allCars = [];

/* ==========================================
   LOAD CARS FROM DJANGO BACKEND
========================================== */

async function loadCars() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to load cars");
    }

    allCars = await response.json();

    displayCars(allCars);
  } catch (error) {
    console.error("Error:", error);

    carContainer.innerHTML = `
            <div class="col-span-full text-center py-10">

                <h3 class="text-2xl font-bold text-red-600">
                    Unable to load cars
                </h3>

                <p class="text-gray-500 mt-2">
                    Please make sure Django backend is running.
                </p>

            </div>
        `;

    carCount.innerText = "0 Cars Available";
  }
}

/* ==========================================
   DISPLAY CARS
========================================== */

function displayCars(cars) {
  carContainer.innerHTML = "";

  carCount.innerText = cars.length + " Cars Available";

  if (cars.length === 0) {
    noResults.classList.remove("hidden");

    return;
  }

  noResults.classList.add("hidden");

  cars.forEach(function (car) {
    const card = document.createElement("div");

    card.className =
      "car-card bg-white rounded-2xl " +
      "overflow-hidden shadow-md " +
      "hover:shadow-xl transition";

    card.innerHTML = `

            <!-- CAR IMAGE -->

            <div class="h-52 overflow-hidden">

                <img
                    src="images/${car.image}"
                    alt="${car.name}"
                    class="w-full h-full object-cover"
                    onerror="this.src='images/car-placeholder.jpg'"
                >

            </div>


            <!-- CAR DETAILS -->

            <div class="p-6">

                <div class="flex justify-between">

                    <div>

                        <h3 class="text-xl font-bold">
                            ${car.name}
                        </h3>

                        <p class="text-gray-500">
                            ${car.type}
                        </p>

                        <span class="
                            inline-block
                            bg-green-100
                            text-green-700
                            text-xs
                            px-3 py-1
                            rounded-full
                            mt-2">

                            ${car.available ? "Available" : "Not Available"}

                        </span>

                    </div>

                </div>


                <!-- SEATS / TRANSMISSION -->

                <div class="flex justify-between mt-5">

                    <span class="text-gray-500">
                        👤 ${car.seats} Seats
                    </span>

                    <span class="text-gray-500">
                        ⚙ ${car.transmission}
                    </span>

                </div>


                <!-- PRICE -->

                <div class="
                    border-t
                    mt-5
                    pt-5
                    flex
                    justify-between
                    items-center">

                    <div>

                        <span class="
                            text-2xl
                            font-bold
                            text-blue-600">

                            ₹${Number(car.price_per_day).toLocaleString(
                              "en-IN",
                            )}

                        </span>

                        <span class="text-gray-500">
                            /day
                        </span>

                    </div>


                    <!-- BOOKING -->

                    <a
                        href="${
                          userId
                            ? `booking.html?car_id=${car.id}&car=${encodeURIComponent(car.name)}&price=${car.price_per_day}`
                            : `login.html?next=${encodeURIComponent(`booking.html?car_id=${car.id}&car=${encodeURIComponent(car.name)}&price=${car.price_per_day}`)}`
                        }"
                        class="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-5 py-2.5
                            rounded-lg
                            font-semibold">

                        Rent Now

                    </a>

                </div>

            </div>
        `;

    carContainer.appendChild(card);
  });
}

/* ==========================================
   FILTER CARS
========================================== */

function filterCars() {
  const search = searchInput.value.toLowerCase().trim();

  const type = typeFilter.value;

  const maxPrice = priceFilter.value;

  const filteredCars = allCars.filter(function (car) {
    const name = car.name.toLowerCase();

    const brand = car.brand.toLowerCase();

    const searchMatch = name.includes(search) || brand.includes(search);

    const typeMatch = type === "all" || car.type.toLowerCase() === type;

    const priceMatch =
      maxPrice === "all" || Number(car.price_per_day) <= Number(maxPrice);

    return searchMatch && typeMatch && priceMatch;
  });

  displayCars(filteredCars);
}

/* ==========================================
   EVENTS
========================================== */

searchInput.addEventListener("input", filterCars);

typeFilter.addEventListener("change", filterCars);

priceFilter.addEventListener("change", filterCars);

/* ==========================================
   START
========================================== */

loadCars();
