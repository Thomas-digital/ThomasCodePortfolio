# Thomas Code - Full Stack Portfolio App 🚀

A cross-platform mobile application built with **Flutter** that serves as a dynamic portfolio. It connects to a custom **PHP & MySQL** backend to fetch real-time project data, demonstrating a complete Full Stack architecture.

## 📱 Features
* **Dynamic Content:** Projects are not hard-coded. They are fetched via a REST API from a MySQL database.
* **Custom Backend:** Integrated with a bespoke PHP API instead of a headless CMS.
* **Real-Time Sync:** Updates to the database reflect instantly on both the Mobile App and the companion Web Client.
* **Payment Integration:** Showcases **Flutterwave** integration for the "Hive" web app project.
* **UI/UX:** Custom Dark Mode design with cached network images.

## 🛠️ Tech Stack
* **Frontend:** Flutter (Dart), Google Fonts, HTTP, URL Launcher
* **Backend:** PHP (Native), MySQL
* **Architecture:** REST API

## 📸 Screenshots
| Home Screen | Project Details |
|:---:|:---:|
| <img src="assets/screenshots/home.png" width="250" /> | <img src="assets/screenshots/details.png" width="250" /> |

## 🚀 How to Run
1.  Clone the repository.
2.  Ensure your local PHP/MySQL server (XAMPP/WAMP) is running.
3.  Update the `apiUrl` in `main.dart` to point to your local IP.
4.  Run `flutter run`.

---
**Built by [Thomas Ozichukwu](https://www.linkedin.com/in/thomas-ozichukwu-40441b304)**