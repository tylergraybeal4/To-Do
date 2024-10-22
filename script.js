let tasks = [];
let completedTasks = 0;
let currentTask = null;
let timerInterval;
let timeElapsed = 0;

document.getElementById("addTaskBtn").addEventListener("click", function() {
    const taskInput = document.getElementById("newTask").value;
    if (taskInput) {
        addTaskBubble(taskInput);
        tasks.push(taskInput);
        updateProgressBar();
        document.getElementById("newTask").value = ""; // Clear input
    }
});

// Add task bubble
function addTaskBubble(taskName) {
    const taskContainer = document.getElementById("taskContainer");
    const bubble = document.createElement("div");
    bubble.className = "task-bubble";
    bubble.textContent = taskName;
    bubble.style.backgroundColor = getRandomColor();
    positionBubble(bubble);
    bubble.addEventListener("click", () => selectTask(bubble, taskName));
    taskContainer.appendChild(bubble);
    applyPhysics(bubble);
}

// Position the bubble at a random location
function positionBubble(bubble) {
    const taskContainer = document.getElementById("taskContainer");
    const containerWidth = taskContainer.offsetWidth;
    const containerHeight = taskContainer.offsetHeight;

    // Ensure the bubble is positioned within bounds
    const bubbleSize = 50; // Assuming each bubble is 50x50px
    bubble.style.left = `${Math.random() * (containerWidth - bubbleSize)}px`;
    bubble.style.top = `${Math.random() * (containerHeight - bubbleSize)}px`;
}

// Apply physics to make bubbles move freely and bounce off each other
function applyPhysics(bubble) {
    const taskContainer = document.getElementById("taskContainer");
    const containerWidth = taskContainer.offsetWidth;
    const containerHeight = taskContainer.offsetHeight;

    let velocityX = (Math.random() - 0.5) * 4;
    let velocityY = (Math.random() - 0.5) * 4;

    function moveBubble() {
        const bubbleRect = bubble.getBoundingClientRect();

        // Check for collision with walls
        if (bubbleRect.left <= 0 || bubbleRect.right >= containerWidth) {
            velocityX = -velocityX;
        }
        if (bubbleRect.top <= 0 || bubbleRect.bottom >= containerHeight) {
            velocityY = -velocityY;
        }

        // Check for collision with other bubbles
        const bubbles = document.getElementsByClassName("task-bubble");
        for (let otherBubble of bubbles) {
            if (otherBubble !== bubble) {
                const otherRect = otherBubble.getBoundingClientRect();
                if (isColliding(bubbleRect, otherRect)) {
                    // Simple collision response: swap velocities
                    velocityX = -velocityX;
                    velocityY = -velocityY;
                }
            }
        }

        // Update position
        bubble.style.left = `${bubble.offsetLeft + velocityX}px`;
        bubble.style.top = `${bubble.offsetTop + velocityY}px`;

        requestAnimationFrame(moveBubble);
    }
    moveBubble();
}

// Collision detection
function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

// Random color generator for bubbles
function getRandomColor() {
    const colors = ['#ff6f61', '#6b5b95', '#88b04b', '#f7cac9', '#92a8d1'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Select and start task
function selectTask(bubble, taskName) {
    currentTask = taskName;
    freezeBubbles();
    document.getElementById("taskPrompt").textContent = `Ready to start the task: "${taskName}"?`;
    document.getElementById("overlay").classList.remove("hidden");
}

// Freeze all bubbles
function freezeBubbles() {
    const bubbles = document.getElementsByClassName("task-bubble");
    for (let bubble of bubbles) {
        bubble.style.animationPlayState = "paused";
    }
}

// Resume bubbles animation
function resumeBubbles() {
    const bubbles = document.getElementsByClassName("task-bubble");
    for (let bubble of bubbles) {
        bubble.style.animationPlayState = "running";
    }
    document.getElementById("overlay").classList.add("hidden");
}

// Start timer
document.getElementById("yesBtn").addEventListener("click", function() {
    document.getElementById("timer").classList.remove("hidden");
    document.getElementById("doneBtn").classList.remove("hidden");
    document.getElementById("pauseBtn").classList.remove("hidden");
    document.getElementById("deleteTaskBtn").classList.remove("hidden");
    startTimer();
});

// Pause or resume task
document.getElementById("pauseBtn").addEventListener("click", function() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById("pauseBtn").textContent = "Resume";
    } else {
        startTimer();
        document.getElementById("pauseBtn").textContent = "Pause";
    }
});

// Complete task
document.getElementById("doneBtn").addEventListener("click", function() {
    clearInterval(timerInterval);
    removeTask(currentTask);
    timeElapsed = 0;
    document.getElementById("timer").classList.add("hidden");
    document.getElementById("doneBtn").classList.add("hidden");
    document.getElementById("pauseBtn").classList.add("hidden");
    document.getElementById("deleteTaskBtn").classList.add("hidden");
    resumeBubbles();
    updateProgressBar();
});

// Delete task
document.getElementById("deleteTaskBtn").addEventListener("click", function() {
    removeTask(currentTask);
    document.getElementById("overlay").classList.add("hidden");
    resumeBubbles();
    updateProgressBar();
});

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, "0");
        const seconds = String(timeElapsed % 60).padStart(2, "0");
        document.getElementById("timeDisplay").textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Remove task
function removeTask(taskName) {
    tasks = tasks.filter(task => task !== taskName);
    completedTasks++;
    const bubbles = document.getElementsByClassName("task-bubble");
    for (let bubble of bubbles) {
        if (bubble.textContent === taskName) {
            bubble.remove();
            break;
        }
    }
}

// Update progress bar
function updateProgressBar() {
    const totalTasks = tasks.length + completedTasks;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById("progressFill").style.width = `${progressPercentage}%`;
    document.getElementById("completedTasksCount").textContent = completedTasks;
    document.getElementById("tasksLeftCount").textContent = tasks.length;
    
    const progressBarContainer = document.getElementById("progressBarContainer");
    if (totalTasks === 0) {
        progressBarContainer.classList.add("hidden");
    } else {
        progressBarContainer.classList.remove("hidden");
    }
}

// Restart tasks
document.getElementById("restartBtn").addEventListener("click", function() {
    tasks = [];
    completedTasks = 0;
    document.getElementById("taskContainer").innerHTML = "";
    updateProgressBar();
});