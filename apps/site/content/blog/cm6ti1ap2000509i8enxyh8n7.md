---
title: "Introduction to React: Building Your First Component with Next.js"
seoTitle: "React & Next.js: Your First Component Guide"
seoDescription: "Learn to create your first React component with Next.js, a powerful framework offering SSR and more. Perfect for new React developers"
datePublished: Thu Feb 06 2025 15:35:16 GMT+0000 (Coordinated Universal Time)
cuid: cm6ti1ap2000509i8enxyh8n7
slug: introduction-to-react-building-your-first-component
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1738806406105/2ef7f03c-e1ae-4817-a86e-2cf58dc4184f.jpeg
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1738806426011/704d487c-4717-4df7-9a17-c0ecbbff6c90.jpeg
tags: javascript, web-development, reactjs, nextjs

---

In this inaugural article of the "Mastering React with Next.js: A Developer's Guide" series, we'll embark on a journey to understand the core concepts of React, a powerful JavaScript library for building user interfaces. Our focus will be on setting up the development environment and creating your first React component using **Next.js**, a robust React framework.

## **Introduction to React**

React is a JavaScript library developed by Facebook for building user interfaces, particularly single-page applications where efficient data updating and rendering are crucial. It allows developers to create reusable UI components, leading to more manageable and scalable code.

## **Why Use Next.js?**

As of early 2025, Create React App (CRA) has been deprecated, making way for modern alternatives like **Next.js**. Next.js offers powerful features, including:

* **File-based routing**: Simplifies route management without additional configuration.
    
* **Server-side rendering (SSR)**: Enhances performance and SEO by rendering pages on the server.
    
* **Static site generation (SSG)**: Generates static HTML at build time for faster page loads.
    
* **Built-in API routes**: Enables serverless function creation directly within your app.
    

With these advantages, Next.js is the preferred choice for building React applications.

---

## **Setting Up the Development Environment**

Before diving into React, ensure your development environment is ready:

* **Node.js and npm**: Next.js relies on Node.js and npm (Node Package Manager) for managing packages. Download and install them from the [official Node.js website](https://nodejs.org/).
    
* **Code Editor**: Choose a code editor like [Visual Studio Code](https://code.visualstudio.com/), which offers excellent support for JavaScript and React.
    

---

## **Creating a New Next.js Application**

To set up a new project with Next.js, follow these steps:

1. **Install Next.js**:
    
    Open your terminal and run:
    
    ```bash
    npx create-next-app@latest my-first-next-app
    ```
    
    This command creates a new directory named `my-first-next-app` with all the necessary files and dependencies.
    
2. **Navigate to the Project Directory**:
    
    ```bash
    cd my-first-next-app
    ```
    
3. **Start the Development Server**:
    
    ```bash
    npm run dev
    ```
    
    Your application will run at `http://localhost:3000/`, and any changes you make will automatically reload the page.
    

---

## **Understanding JSX**

JSX (JavaScript XML) is a syntax extension for JavaScript that resembles HTML. It's used in React to describe what the UI should look like. JSX makes the code more readable and easier to write. For example:

```typescript
const element = <h1>Hello, world!</h1>;
```

This JSX code is transformed into standard JavaScript by tools like Babel.

---

## **Creating Your First Component**

Components are the building blocks of a React application. A component can be a function or a class that returns a React element. Here's how to create a simple functional component in Next.js:

### **Define the Component**

1. Create a new folder named `components` in your project directory.
    
    ```bash
    mkdir components
    ```
    
2. Create a new file named `Greeting.js` inside the `components` folder:
    
    ```typescript
    const Greeting = () => {
      return <h1>Welcome to React with Next.js!</h1>;
    };
    
    export default Greeting;
    ```
    

### **Use the Component**

3. In the `pages/index.js` file, import and use the `Greeting` component:
    
    ```typescript
    import Greeting from '../components/Greeting';
    
    export default function Home() {
      return (
        <div>
          <Greeting />
        </div>
      );
    }
    ```
    

Save your changes and visit [http://localhost:3000](http://localhost:3000). You should see "Welcome to React with Next.js!" displayed on the page.

---

## **Adding Styles to Your Component**

Next.js supports CSS Modules by default, making it easy to style components. Let’s add some styles to `Greeting`:

1. Create a new file called `Greeting.module.css` in the `components` folder:
    
    ```css
    .title {
      font-size: 2rem;
      color: #0070f3;
      text-align: center;
      margin-top: 50px;
    }
    ```
    
2. Update `Greeting.js` to use these styles:
    
    ```typescript
    import styles from './Greeting.module.css';
    
    const Greeting = () => {
      return <h1 className={styles.title}>Welcome to React with Next.js!</h1>;
    };
    
    export default Greeting;
    ```
    

Reload the page, and you’ll see the styled component.

---

## **Conclusion**

In this article, we've set up the development environment and created our first React component using Next.js. Understanding these basics is crucial as we delve deeper into React's capabilities in the upcoming articles. Stay tuned as we explore components, props, state, and more in the next installments of this series.