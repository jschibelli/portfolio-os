---
title: "Lifecycle Methods and Introduction to Hooks"
seoTitle: "React Hooks vs Lifecycle Methods"
seoDescription: "Explore React component lifecycles, class lifecycle methods, and Hooks like `useState` and `useEffect` to manage state and side effects efficiently"
datePublished: Fri Feb 21 2025 14:00:39 GMT+0000 (Coordinated Universal Time)
cuid: cm7eu9dnp00050ajog5qj3abj
slug: lifecycle-methods-and-introduction-to-hooks
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1740063185820/a14cc7fe-91f5-4c93-b07b-23eda25f1d59.jpeg
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1740063229899/8fb53b0b-42ea-4d26-ba0f-254bcfcc3ca8.jpeg
tags: javascript, web-development, reactjs, reacthooks

---

### Introduction

In our **previous tutorial** on [Event Handling & Conditional Rendering in React](https://schibelli.dev/event-handling-conditional-rendering-in-react), we zeroed in on user interactions and seamlessly showed or hid bits of the UI. Now, let’s step back and look at **React’s component lifecycle**—how it’s born, lives, and gets cleared—and we’ll also dip into **Hooks**, the modern way to handle state and side effects.

Whether you love class components or you’re all about functional ones, getting a handle on the lifecycle ensures you can craft apps that behave consistently. This piece walks you through React’s old-school lifecycle methods and lines them up next to how Hooks tackle the same tasks (with a lighter syntax, might I add).

---

### What We’ll Cover

* **React Lifecycle Rundown**  
    How a component gets mounted, updated, and unmounted.
    
* **Lifecycle Methods in Class Components**  
    Favorites like `componentDidMount`, `componentDidUpdate`, and how `componentWillUnmount` helps keep memory leaks at bay.
    
* **Intro to Hooks**  
    Why Hooks are a big deal, plus quick intros to `useState` and `useEffect`.
    
* **Practical Examples**  
    Real-world usage and how these approaches compare.
    
* **Pitfalls and Best Practices**  
    Keep your code tidy and performance sharp.
    

---

### 1\. A Quick Lifecycle Recap

Class components follow three stages:

1. **Mounting**: Born and inserted into the DOM (from the initial creation of its elements to attaching them in the browser).
    
2. **Updating**: React re-renders when props or state shift.
    
3. **Unmounting**: The component is taken out of the DOM for good.
    

Each stage has methods you can override, which is both powerful and a bit tedious.

---

### 2\. Class Component Lifecycle Methods

1. `componentDidMount()`  
    Right after the component shows up in the DOM, which is an ideal place to run code that depends on the component being in the document (like initial data fetches, DOM manipulations, or hooking up to external services).
    
2. `componentDidUpdate(prevProps, prevState)`  
    Fires after every update. Here, you can check what changed by comparing `prevProps` or `prevState` with current values. If something important differs, you might trigger additional logic (like fetching new data or updating the DOM). Be careful, though—if you call `this.setState` in here without a condition, you can cause an infinite loop. This is the perfect place to handle side effects such as DOM tweaks, sending analytics data, or conditionally fetching resources based on updated props.
    
3. `componentWillUnmount()`  
    Right before the component is removed from the DOM, do your final cleanup—like clearing intervals, unsubscribing from data streams, or anything else that might keep running behind the scenes. This ensures you don’t leave memory leaks or orphaned processes in your app.
    
4. **Others**  
    `shouldComponentUpdate()` helps you decide if a re-render is needed based on prop/state changes—great for squeezing extra performance out of your app. Meanwhile, `getSnapshotBeforeUpdate()` runs right before the DOM is updated, letting you capture information (like scroll positions) for use immediately after the DOM updates. While you won’t see these all the time, they’re invaluable in advanced or edge-case scenarios where you need tight control of your component’s behavior.
    

**Class-based Example**

```typescript
class Timer extends React.Component {
  state = { seconds: 0 };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prev) => ({ seconds: prev.seconds + 1 }));
    }, 1000);
  }

  componentDidUpdate() {
    console.log(`Timer updated: ${this.state.seconds}`);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return <h2>Elapsed: {this.state.seconds}s</h2>;
  }
}
```

---

### 3\. Enter Hooks

React Hooks (from 16.8 onward) give functional components state and side effect superpowers—no classes needed.

**Why Hooks?**

* **Less Boilerplate**: No more messing with `this`.
    
* **Reusable Logic**: Custom hooks let you bundle patterns.
    
* **Cleaner**: Keep your components simpler.
    

### `useState` & `useEffect`

* `useState`: For local state, letting your component keep track of data that changes over time (like counters, toggles, or input fields). Each call to `useState` returns a piece of state and a setter function, ensuring when you update that state, React automatically re-renders the component to reflect the changes.
    
* `useEffect`: This Hook takes care of all those side effects that class components used to handle across `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. It’s where you can fetch data once the component is on the screen, watch for changes in props or state, and run a cleanup function when the component unmounts. That means everything from simple data fetching to more advanced DOM or subscription management can live in a single, organized place—just be mindful of the dependency array to avoid infinite loops.
    

**Hook-based Example**

```typescript
import React, { useState, useEffect } from 'react';

function TimerHook() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <h2>Elapsed: {seconds}s</h2>;
}
```

Notice how a single `useEffect` can do it all—init, update, and clean up.

---

### 4\. Lifecycle, the Hook Way

* **Mounting**: `useEffect(() => { ... }, [])` runs once.
    
* **Updating**: `useEffect(() => { ... }, [dep])` runs on changes.
    
* **Unmounting**: Return a cleanup function within `useEffect`.
    

---

### 5\. Quick Class vs. Hooks Comparison

**Class**

```typescript
componentDidMount() {
  // fetch once
}

componentDidUpdate() {
  // watch some updates
}

componentWillUnmount() {
  // cleanup
}
```

**Hooks**

```typescript
useEffect(() => {
  // fetch once
}, []);

useEffect(() => {
  // watch some updates
}, [someVar]);

// cleanup is in the return statement
```

---

### 6\. Tying It Back to Event Handling & Conditional Rendering

In the last tutorial, we saw how to show/hide components and respond to user events. That logic still applies in class or function components. But when we add lifecycle triggers (or `useEffect` in hooks), we gain even more fine-grained control over when and how the UI updates.

---

### 7\. Gotchas & Best Practices

1. **Infinite Loops**: If your `useEffect` modifies some piece of state that’s also in the dependency array, you risk the effect re-running every time that state changes—leading to an endless re-render cycle. For example, if an effect sets state on each run, that new state triggers another render, which triggers the effect again, and so on. To avoid this, either condition your state updates or remove them from the dependency array unless truly needed, ensuring you don’t trap yourself in an infinite loop.
    
2. **Cleanup**: Always handle unsubscribing or clearing intervals in the cleanup function.
    
3. **Separation of Concerns**: Use multiple effects if they handle different logic. Don’t lump everything into one.
    

---

### 8\. Wrapping Up

We’ve covered how a React component’s lifecycle works in class-based land and how Hooks simplify the same concepts in functional components. Knowing both ensures you can jump into old or new code confidently.

**Coming Up Next**: We’ll explore more advanced Hooks and manage global state with `useContext`. Until then, keep practicing the patterns from [our previous tutorial](https://schibelli.dev/event-handling-conditional-rendering-in-react)—and apply them with lifecycle methods in mind.

**Got questions?** Feel free to drop them in the comments or reach out on social media. Let’s keep leveling up those React skills!