import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-snake',
  templateUrl: './snake.page.html',
  imports: [CommonModule, IonicModule],
  styleUrls: ['./snake.page.scss'],
})
export class SnakePage implements OnInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private snake!: { x: number; y: number }[];
  private direction!: string;
  private nextDirection!: string;

  private snake2!: { x: number; y: number }[];
  private direction2!: string;
  private nextDirection2!: string;

  private food!: { x: number; y: number };
  private gameInterval: any;

  public isPlaying: boolean = false;
  public gameOver: boolean = false;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    // Não iniciar automaticamente - aguardamos o Play
    this.resetPositions();

    window.addEventListener('keydown', (event) => {
      const key = event.key;
      // Cobra 1 (setas)
      if (key === 'ArrowUp' && this.direction !== 'DOWN') {
        this.nextDirection = 'UP';
      } else if (key === 'ArrowDown' && this.direction !== 'UP') {
        this.nextDirection = 'DOWN';
      } else if (key === 'ArrowLeft' && this.direction !== 'RIGHT') {
        this.nextDirection = 'LEFT';
      } else if (key === 'ArrowRight' && this.direction !== 'LEFT') {
        this.nextDirection = 'RIGHT';
      }
      // Cobra 2 (WASD)
      if (key === 'w' && this.direction2 !== 'DOWN') {
        this.nextDirection2 = 'UP';
      } else if (key === 's' && this.direction2 !== 'UP') {
        this.nextDirection2 = 'DOWN';
      } else if (key === 'a' && this.direction2 !== 'RIGHT') {
        this.nextDirection2 = 'LEFT';
      } else if (key === 'd' && this.direction2 !== 'LEFT') {
        this.nextDirection2 = 'RIGHT';
      }
    });
  }

  // Botão Play chama este método
  public startGame(): void {
    this.resetPositions();
    this.gameOver = false;
    this.isPlaying = true;
    this.startGameLoop();
  }

  // Botão Reset reutiliza startGame
  public resetGame(): void {
    this.startGame();
  }

  private startGameLoop(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    this.gameInterval = setInterval(() => {
      this.clearCanvas();
      this.moveSnake();
      this.moveSnake2();
      this.checkCollisions();
      this.drawSnake();
      this.drawSnake2();
      this.drawFood();
    }, 60);
  }

  private resetPositions(): void {
    // Inicializa cobra 1 com 5 segmentos
    this.snake = [];
    for (let i = 0; i < 5; i++) {
      this.snake.push({ x: 10 - 10 * i, y: 10 });
    }
    this.direction = 'RIGHT';
    this.nextDirection = this.direction;

    // Inicializa cobra 2 com 5 segmentos
    this.snake2 = [];
    for (let i = 0; i < 5; i++) {
      this.snake2.push({ x: 10 - 10 * i, y: 200 });
    }
    this.direction2 = 'RIGHT';
    this.nextDirection2 = this.direction2;

    this.food = this.generateFood();
  }

  private clearCanvas(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private moveSnake(): void {
    this.direction = this.nextDirection;
    const head = { ...this.snake[0] };
    switch (this.direction) {
      case 'UP': head.y -= 10; break;
      case 'DOWN': head.y += 10; break;
      case 'LEFT': head.x -= 10; break;
      case 'RIGHT': head.x += 10; break;
    }
    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.food = this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  private moveSnake2(): void {
    this.direction2 = this.nextDirection2;
    const head = { ...this.snake2[0] };
    switch (this.direction2) {
      case 'UP': head.y -= 10; break;
      case 'DOWN': head.y += 10; break;
      case 'LEFT': head.x -= 10; break;
      case 'RIGHT': head.x += 10; break;
    }
    this.snake2.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.food = this.generateFood();
    } else {
      this.snake2.pop();
    }
  }

  private checkCollisions(): void {
    const head1 = this.snake[0];
    const head2 = this.snake2[0];

    // Cobra 1 colide com parede
    if (head1.x < 0 || head1.x >= this.canvas.width || head1.y < 0 || head1.y >= this.canvas.height) {
      this.endGame(); return;
    }
    // Cobra 2 colide com parede
    if (head2.x < 0 || head2.x >= this.canvas.width || head2.y < 0 || head2.y >= this.canvas.height) {
      this.endGame(); return;
    }
    // Cobra 1 colide ela mesma
    for (let i = 1; i < this.snake.length; i++) {
      if (head1.x === this.snake[i].x && head1.y === this.snake[i].y) {
        this.endGame(); return;
      }
    }
    // Cobra 2 colide ela mesma
    for (let i = 1; i < this.snake2.length; i++) {
      if (head2.x === this.snake2[i].x && head2.y === this.snake2[i].y) {
        this.endGame(); return;
      }
    }
    // Cobra 1 colide com corpo da Cobra 2
    for (const seg of this.snake2) {
      if (head1.x === seg.x && head1.y === seg.y) {
        this.endGame(); return;
      }
    }
    // Cobra 2 colide com corpo da Cobra 1
    for (const seg of this.snake) {
      if (head2.x === seg.x && head2.y === seg.y) {
        this.endGame(); return;
      }
    }
  }

  private endGame(): void {
    this.gameOver = true;
    this.isPlaying = false;
    clearInterval(this.gameInterval);
  }

  public drawSnake(): void {
    this.ctx.fillStyle = 'green';
    for (const seg of this.snake) {
      this.ctx.fillRect(seg.x, seg.y, 10, 10);
    }
  }

  public drawSnake2(): void {
    this.ctx.fillStyle = 'blue';
    for (const seg of this.snake2) {
      this.ctx.fillRect(seg.x, seg.y, 10, 10);
    }
  }

  public drawFood(): void {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.food.x, this.food.y, 10, 10);
  }

  private generateFood(): { x: number; y: number } {
    const x = Math.floor(Math.random() * (this.canvas.width / 10)) * 10;
    const y = Math.floor(Math.random() * (this.canvas.height / 10)) * 10;
    return { x, y };
  }
}
