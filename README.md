<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=260&color=0:2563eb,50:3b82f6,100:06b6d4&text=Aksharasethu&fontSize=56&fontAlignY=40&animation=fadeIn&fontColor=ffffff&desc=Official%20Digital%20Library%20of%20NSS%20Model%20Engineering%20College&descAlignY=62" width="100%" />

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=24&duration=3000&pause=1200&color=3B82F6&center=true&vCenter=true&width=900&lines=Organize.+Preserve.+Share+Knowledge.;Modern+Digital+Library.;Built+with+Next.js+16+%2B+Supabase.;Powered+by+Google+Drive.)](https://git.io/typing-svg)

<p>

<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs">
<img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript">
<img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase">
<img src="https://img.shields.io/badge/Google%20Drive-Storage-4285F4?style=for-the-badge&logo=googledrive">
<img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss">
<img src="https://img.shields.io/github/license/USERNAME/aksharasethu?style=for-the-badge">

</p>

</div>

---

# 📚 About

> A centralized academic repository developed for **NSS Model Engineering College**.

Aksharasethu enables students to upload, discover, organize, preview and download academic resources including notes, textbooks, previous-year question papers, lab manuals and more.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📖 Library

- Advanced Search
- Categories
- Tags
- PDF Preview
- Downloads
- Bookmarks
- Collections

</td>

<td width="50%">

### 🚀 Platform

- Google Authentication
- Google Drive Storage
- Supabase Database
- Admin Dashboard
- Analytics
- Responsive UI

</td>
</tr>
</table>

---

# 🛠 Tech Stack

<p align="center">

<img src="https://skillicons.dev/icons?i=nextjs,ts,tailwind,supabase,postgres,vercel,git,github,vscode" />

</p>

---

# 🏗 Architecture

```text
              Users
                 │
                 ▼
      Next.js 16 Application
                 │
     ┌───────────┴────────────┐
     ▼                        ▼
Supabase Auth         API Route Handlers
     │                        │
     ▼                        ▼
 PostgreSQL          Google Drive API
     │                        │
     └──────────────┬─────────┘
                    ▼
              Academic PDFs
```

---

# 📂 Project Structure

```text
src
├── app
├── actions
├── components
├── hooks
├── lib
│   ├── drive
│   ├── supabase
│   └── validations
├── services
├── types
└── utils
```

---

# 📈 Workflow

```mermaid
flowchart LR

A[Student Uploads PDF]
-->B[Validate]
-->C[Upload to Google Drive]
-->D[Generate Public Link]
-->E[Store Metadata in Supabase]
-->F[Available in Library]
```

---

# 🚀 Getting Started

```bash
git clone https://github.com/USERNAME/aksharasethu.git

cd aksharasethu

pnpm install

pnpm dev
```

---

<div align="center">

### ⭐ If you find this project useful, consider starring the repository.

<img src="https://capsule-render.vercel.app/api?type=waving&section=footer&height=140&color=0:2563eb,50:3b82f6,100:06b6d4"/>

</div>