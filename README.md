
# 🗱️ Gatekeeper 

> A robust web-based application designed to streamline residential society operations. Gatekeeper ensures secure resident login, real-time communication, visitor and delivery tracking, and seamless maintenance handling – all in one platform.

---

## 📌 Features

* **Secure Login with MFA**: Two-factor authentication using OTP for added security.
* **Resident Dashboard**: Displays messages, requests, and community event updates.
* **Visitor Pre-registration**: Allows residents to pre-register visitors and notifies admins instantly.
* **Delivery Tracking**: Real-time package status updates with notification support.
* **Maintenance Requests**: Residents can raise and track maintenance issues; admins can approve and respond.
* **Real-time Notifications**: Alerts for delivery, maintenance updates, and visitor arrivals.
* **Community Events Feed**: Lists events and announcements for residents with archive of expired event.

---

## 📅 Modules & Functionality

### Resident Side

* Login with OTP verification
* Dashboard for updates and activity
* Raise maintenance tickets
* Pre-register guests and track deliveries
* View upcoming community events

### Admin Side

* Manage user accounts and profile edits
* Approve or reject maintenance requests
* Get real-time visitor notifications
* Broadcast events and announcements

---

## 🔧 Tech Stack

* **Frontend**: eact,Tailwind CSS,Vite 
* **Backend**: Flask (Python)
* **Database**: Supabase

---

## 📂 Folder Structure (Suggested)

```plaintext
Gatekeeper/
├── static/
├── templates/
├── app.py
├── requirements.txt
└── README.md
```

---

## 💡 Future Enhancements

* Add dashboard analytics for admins
* Implement role-based access (security, facility manager, etc.)
* Add downloadable reports for maintenance and visitor logs
* Mobile PWA version for offline access

---
 
## 🙌 Contributing

Contributions are welcome! Please fork the repo, create a feature branch, and raise a pull request.

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/sanskarkesari/gatekeeper.git
cd gatekeeper

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```


---
