const contactForm = document.getElementById("main_contact_content_right_form");

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("main_contact_content_right_form_name").value.trim();
    const email = document.getElementById("main_contact_content_right_form_email").value.trim();
    const number = document.getElementById("main_contact_content_right_form_number").value.trim();
    const message = document.getElementById("main_contact_content_right_form_message").value.trim();

    try {
        const response = await fetch("http://localhost:5000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name, email, number, message })
        });

        const data = await response.json();

        if(data.success) {
            alert("Thank you, your message has been sent.");

            contactForm.reset();
        }
        else {
            alert(data.error || "Something went wrong, please try again.");
        }
    }
    catch(error) {
        console.error(error);

        alert("Network error, please try again.");
    }
});