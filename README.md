# 📚 Book Explorer – Gutendex API Integration

An application built with **HTML**, **CSS**, and **JavaScript**, utilizing the [Gutendex Books API](https://gutendex.com/) to display a collection of books with search, filter, wishlist, and pagination functionalities.

---

## 🚀 Features

### 📖 Book Listing
- Fetches books from `https://gutendex.com/books`
- Displays:  
  - ✅ Title  
  - ✅ Author(s)  
  - ✅ Cover image  
  - ✅ Genre/Topic  
  - ✅ Book ID

### 🔍 Search & Filters
- 🔎 **Real-time Search** by title
- 🎯 **Genre Dropdown Filter** based on subjects/tags
- ❤️ **Wishlist Functionality**
  - Add/remove books to/from wishlist
  - Stored in `localStorage`
  - Visual "liked" icon toggle

### 📄 Pages
- 🏠 **Homepage** – Book listing with pagination
- 💖 **Wishlist Page** – Displays saved books from `localStorage`

### 📚 Pagination
- 📄 Paginated book list (e.g., next/previous or page numbers)

### 🧭 Navigation
- Responsive **navbar** to navigate between:
  - Home
  - Wishlist

---

## 💡 Bonus Features (Optional)
- 🎞️ Smooth animations for showing/hiding books

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **No frameworks used** (SPA via DOM manipulation)
- **LocalStorage** for wishlist 

---

## ⚙️ How to Run Locally

1. **Clone the repository**
```bash
git clone https://github.com/Abir-Al-Arafat/zepto-apps-task2.git
```

2. **go to folder**
```bash
cd book-explorer
```

3. **Open index.html in vscode**.
no server setup required.
open with Live Server extension in VS Code.
