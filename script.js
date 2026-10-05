// ==========================================
// ECHO STUDY SPACE
// SEAT BOOKING
// ==========================================


// ==========================================
// GOOGLE APPS SCRIPT API
// ==========================================

// IMPORTANT:
// Replace this with your actual /exec URL.

const API_URL =
    "https://script.google.com/macros/s/AKfycbyBLmIPIc9lZo_UbJLegvCYIKTCfbNuumjm-IzRZJupQN1rS-lpC2dki2ZUy0NNt_GKoQ/exec";


// ==========================================
// PAGE ELEMENTS
// ==========================================

const rowButtons =
    document.querySelectorAll(".row-btn");

const tableBody =
    document.getElementById(
        "seat-table-body"
    );

const seatTitle =
    document.getElementById(
        "seat-title"
    );

const loading =
    document.getElementById(
        "loading"
    );

const seatSection =
    document.getElementById(
        "seat-section"
    );

const selectionBox =
    document.getElementById(
        "selection-box"
    );

const selectedSeatText =
    document.getElementById(
        "selected-seat"
    );

const proceedButton =
    document.getElementById(
        "proceed-btn"
    );

const bookingFormSection =
    document.getElementById(
        "booking-form-section"
    );

const bookingForm =
    document.getElementById(
        "booking-form"
    );

const formSeat =
    document.getElementById(
        "form-seat"
    );

const changeSeatButton =
    document.getElementById(
        "change-seat-btn"
    );

const planSelect =
    document.getElementById(
        "plan"
    );

const startTimeGroup =
    document.getElementById(
        "start-time-group"
    );

const startTimeInput =
    document.getElementById(
        "start-time"
    );


// ==========================================
// VARIABLES
// ==========================================

let allSeats = [];

let selectedSeat = null;

let selectedRow = null;


// ==========================================
// LOAD SEATS
// ==========================================

async function loadSeats() {

    try {

        loading.textContent =
            "Loading seats...";


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Request failed"
            );
        }


        allSeats =
            await response.json();


        loading.textContent = "";


    } catch (error) {

        console.error(
            "Unable to load seat data:",
            error
        );


        loading.textContent =
            "Unable to load seats.";

    }

}


// ==========================================
// ROW BUTTONS
// ==========================================

rowButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const row =
                button.dataset.row;


            selectedRow = row;


            // Highlight selected row button

            rowButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            // Clear previous seat selection

            selectedSeat = null;


            selectionBox.classList.add(
                "hidden"
            );


            // Display seats

            displaySeats(row);

        }
    );

});


// ==========================================
// DISPLAY SEATS
// ==========================================

function displaySeats(row) {

    tableBody.innerHTML = "";


    seatTitle.textContent =
        `Seats in Row ${row}`;


    const rowSeats =
        allSeats.filter(seat => {

            return seat.seat &&
                seat.seat.startsWith(row);

        });


    rowSeats.forEach(seat => {


        // ==================================
        // CREATE TABLE ROW
        // ==================================

        const tableRow =
            document.createElement("tr");


        tableRow.classList.add(
            "seat-row"
        );


        const isAvailable =
            seat.status.includes(
                "Available"
            );


        if (isAvailable) {

            tableRow.classList.add(
                "available"
            );

        }


        // ==================================
        // SEAT CELL
        // ==================================

        const seatCell =
            document.createElement("td");


        seatCell.classList.add(
            "seat-number"
        );


        if (isAvailable) {

            seatCell.textContent =
                seat.seat;

        } else {

            seatCell.textContent =
                seat.seat;

        }


        // ==================================
        // STATUS CELL
        // ==================================

        const statusCell =
            document.createElement("td");


        if (isAvailable) {

            statusCell.textContent =
                "● Available";

            statusCell.classList.add(
                "status-available"
            );

        } else {

            statusCell.textContent =
                "● Occupied";

            statusCell.classList.add(
                "status-occupied"
            );

        }


        // ==================================
        // EXPIRY CELL
        // ==================================

        const expiryCell =
            document.createElement("td");


        expiryCell.classList.add(
            "expiry"
        );


        if (seat.expiry) {

            expiryCell.textContent =
                seat.expiry;

        } else {

            expiryCell.textContent =
                "—";

        }


        // ==================================
        // ADD CELLS
        // ==================================

        tableRow.appendChild(
            seatCell
        );

        tableRow.appendChild(
            statusCell
        );

        tableRow.appendChild(
            expiryCell
        );


        // ==================================
        // AVAILABLE ROW CLICK
        // ==================================

        if (isAvailable) {

            tableRow.addEventListener(
                "click",
                () => {

                    selectSeat(
                        seat.seat,
                        tableRow
                    );

                }
            );

        }


        // ==================================
        // ADD ROW TO TABLE
        // ==================================

        tableBody.appendChild(
            tableRow
        );

    });

}


// ==========================================
// SELECT SEAT
// ==========================================

function selectSeat(
    seatNumber,
    selectedTableRow
) {

    // Remove previous selected row

    document
        .querySelectorAll(
            ".seat-row.selected"
        )
        .forEach(row => {

            row.classList.remove(
                "selected"
            );

            const check =
                row.querySelector(
                    ".seat-check"
                );

            if (check) {

                check.remove();

            }

        });


    // Store selected seat

    selectedSeat =
        seatNumber;


    // Highlight selected row

    selectedTableRow.classList.add(
        "selected"
    );


    // Add check mark

    const check =
        document.createElement(
            "span"
        );

    check.classList.add(
        "seat-check"
    );

    check.textContent =
        "✓";


    // Put check before seat number

    selectedTableRow
        .querySelector(
            ".seat-number"
        )
        .prepend(check);


    // Update selected seat box

    selectedSeatText.textContent =
        selectedSeat;


    selectionBox.classList.remove(
        "hidden"
    );

}


// ==========================================
// PROCEED TO FORM
// ==========================================

proceedButton.addEventListener(
    "click",
    () => {

        if (!selectedSeat) {

            return;

        }


        // Put seat into form

        formSeat.value =
            selectedSeat;


        // Hide seat selection

        seatSection.classList.add(
            "hidden"
        );

        selectionBox.classList.add(
            "hidden"
        );


        // Show booking form

        bookingFormSection.classList.remove(
            "hidden"
        );


        // Scroll to form

        bookingFormSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


// ==========================================
// CHANGE SEAT
// ==========================================

changeSeatButton.addEventListener(
    "click",
    () => {

        // Hide booking form

        bookingFormSection.classList.add(
            "hidden"
        );


        // Show seat section

        seatSection.classList.remove(
            "hidden"
        );


        // Clear form seat

        formSeat.value = "";


        // Clear selection

        selectedSeat = null;


        selectionBox.classList.add(
            "hidden"
        );


        // Scroll back to seats

        seatSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


// ==========================================
// PLAN → START TIME
// ==========================================

planSelect.addEventListener(
    "change",
    () => {

        const plan =
            planSelect.value;


        const timeRequired =
            plan === "3 Hour" ||
            plan === "7 Hour" ||
            plan === "12 Hour" ||
            plan === "1 Day";


        if (timeRequired) {

            startTimeGroup.classList.remove(
                "hidden"
            );

            startTimeInput.required =
                true;

        } else {

            startTimeGroup.classList.add(
                "hidden"
            );

            startTimeInput.required =
                false;

            startTimeInput.value =
                "";

        }

    }
);


// ==========================================
// FORM SUBMISSION → WHATSAPP
// ==========================================

bookingForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        // ==================================
        // GET FORM VALUES
        // ==================================

        const name =
            document.getElementById(
                "full-name"
            ).value.trim();


        const mobile =
            document.getElementById(
                "mobile"
            ).value.trim();


        const plan =
            planSelect.value;


        const startDate =
            document.getElementById(
                "start-date"
            ).value;


        const startTime =
            startTimeInput.value;


        const course =
            document.getElementById(
                "course"
            ).value.trim();


        const info =
            document.getElementById(
                "info"
            ).value.trim();


        // ==================================
        // PLAN PRICES
        // ==================================

        const prices = {

            "3 Hour": 79,

            "7 Hour": 139,

            "12 Hour": 169,

            "1 Day": 189,

            "7 Day": 700,

            "1 Month": 2000,

            "3 Month": 5499,

            "6 Month": 10499

        };


        const amount =
            prices[plan];


        // ==================================
        // CREATE WHATSAPP MESSAGE
        // ==================================

        let message =
            `*ECHO Study Space - Booking Request*%0A%0A` +

            `*Name:* ${name}%0A` +

            `*Mobile:* ${mobile}%0A` +

            `*Seat:* ${selectedSeat}%0A` +

            `*Plan:* ${plan}%0A` +

            `*Amount:* ₹${amount}%0A` +

            `*Start Date:* ${startDate}%0A`;


        // Add start time only for short plans

        if (startTime) {

            message +=
                `*Start Time:* ${startTime}%0A`;

        }


        message +=
            `*Course / Exam:* ${course}%0A` +

            `*How they heard about ECHO:* ${info || "Not provided"}%0A%0A` +

            `Please confirm my booking.`;


        // ==================================
        // WHATSAPP NUMBER
        // ==================================

        const whatsappNumber =
            "919778262436";


        // ==================================
        // OPEN WHATSAPP
        // ==================================

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${message}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);

// ==========================================
// START
// ==========================================

loadSeats().then(() => {

    // Automatically select Row A

    const firstRowButton =
        document.querySelector(
            '[data-row="A"]'
        );


    if (firstRowButton) {

        firstRowButton.click();

    }

});