import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, Task } from '../services/task.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  loading: boolean = true;
  error: string | null = null;
  isAddingTask: boolean = false;
  userName: string = 'User';
  currentDate: string = '';
  greeting: string = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Get user name from localStorage
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          this.userName = user.name || user.email || 'User';
        }
      } catch { }
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 17) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';

    // Format current date
    this.currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    }
  }

  loadTasks() {
    this.loading = true;
    this.error = null;
    this.taskService.getTasks()
      .pipe(
        finalize(() => { this.loading = false; })
      )
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks || [];
          this.filterByStatus();
          this.updateCounters();
        },
        error: (err) => {
          console.error('Failed to fetch tasks', err);
          if (err.status === 0) {
            this.error = 'Network error: Backend is unreachable.';
          } else if (err.status === 401 || err.status === 403) {
            this.authService.logout();
            this.router.navigate(['/login']);
            this.error = 'Session expired. Please login again.';
          } else {
            this.error = `Server Error (${err.status}): Unable to fetch tasks.`;
          }
        }
      });
  }

  // Stats
  tc = { total: 0, todo: 0, inProgress: 0, done: 0 };
  get completionRate(): number {
    if (this.tc.total === 0) return 0;
    return Math.round((this.tc.done / this.tc.total) * 100);
  }

  filteredTasks: {todo: Task[];inProgress: Task[];done: Task[]} = {todo: [],inProgress: [],done: []};
  // No loadTasks implementation here – removed duplicate
  filterByStatus(){
    this.filteredTasks.todo = this.tasks.filter(t=>t.status==='todo');
    this.filteredTasks.inProgress = this.tasks.filter(t=>t.status==='in-progress');
    this.filteredTasks.done = this.tasks.filter(t=>t.status==='done');
  }
  updateCounters(){this.tc.total=this.tasks.length;
    this.tc.todo=this.filteredTasks.todo.length;
    this.tc.inProgress=this.filteredTasks.inProgress.length;
    this.tc.done=this.filteredTasks.done.length;}

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: Task = {
      title: this.newTaskTitle.trim(),
      status: 'todo'
    };

    this.taskService.createTask(newTask).subscribe({
      next: (created) => {
        this.tasks.push(created);
        this.newTaskTitle = '';
        this.isAddingTask = false;
      },
      error: (err) => {
        console.error('Failed to create task', err);
        alert('Failed to create task. Please try again.');
      }
    });
  }

  updateTaskStatus(task: Task, newStatus: 'todo' | 'in-progress' | 'done') {
    if (task.status === newStatus) return;

    const originalStatus = task.status;
    task.status = newStatus;

    if (task._id) {
      this.taskService.updateTask(task._id, { ...task, status: newStatus }).subscribe({
        error: (err) => {
          console.error('Failed to update task', err);
          task.status = originalStatus;
        }
      });
    }
  }

  deleteTask(task: Task) {
    if (!confirm('Delete this task?')) return;

    this.tasks = this.tasks.filter(t => t._id !== task._id);

    if (task._id) {
      this.taskService.deleteTask(task._id).subscribe({
        error: (err) => {
          console.error('Failed to delete task', err);
          this.tasks.push(task);
        }
      });
    }
  }

  cancelAddTask() {
    this.isAddingTask = false;
    this.newTaskTitle = '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
