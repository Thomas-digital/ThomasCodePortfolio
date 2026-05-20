import 'dart:math'; // Used for random start angle
import 'package:flutter/material.dart';
import '../contact_screen.dart'; // Import your Profile Page

class PixelPongGame extends StatefulWidget {
  const PixelPongGame({super.key});

  @override
  State<PixelPongGame> createState() => _PixelPongGameState();
}

class _PixelPongGameState extends State<PixelPongGame>
    with TickerProviderStateMixin {
  // --- SETTINGS ---
  double ballX = 0;
  double ballY = 0;

  // STARTING SPEEDS (Increased base speed)
  double ballXDirection = 0.02;
  double ballYDirection = 0.01;

  double playerY = 0;
  double aiY = 0;

  // INCREASED PADDLE SIZE
  double paddleHeight = 0.25; // 25% of screen height (Bigger)
  double paddleWidth = 0.05; // 5% of screen width (Wider)

  bool gameStarted = false;
  int playerScore = 0;
  int aiScore = 0;

  late AnimationController _gameLoopController;

  @override
  void initState() {
    super.initState();
    // High FPS Game Loop
    _gameLoopController = AnimationController(
      vsync: this,
      duration: const Duration(hours: 1),
    );
    _gameLoopController.addListener(_gameLoop);
  }

  @override
  void dispose() {
    _gameLoopController.dispose();
    super.dispose();
  }

  void _startGame() {
    setState(() {
      gameStarted = true;
      _resetBall();
      playerScore = 0;
      aiScore = 0;
    });
    _gameLoopController.repeat();
  }

  void _resetBall() {
    setState(() {
      ballX = 0;
      ballY = 0;
      // Reset speed to base level
      double direction = (Random().nextBool() ? 1 : -1);
      ballXDirection = 0.02 * direction;
      ballYDirection = 0.015 * (Random().nextBool() ? 1 : -1);
    });
  }

  void _gameLoop() {
    setState(() {
      // 1. Move Ball
      ballX += ballXDirection;
      ballY += ballYDirection;

      // 2. AI Movement (Tracks ball aggressively)
      // AI gets faster as the ball gets faster
      double aiSpeed = 0.02 + (ballXDirection.abs() * 0.5);
      if (ballY > aiY + 0.05) {
        aiY += aiSpeed;
      } else if (ballY < aiY - 0.05) {
        aiY -= aiSpeed;
      }
      // Clamp AI to screen
      if (aiY > 0.9) aiY = 0.9;
      if (aiY < -0.9) aiY = -0.9;

      // 3. Wall Collision (Top/Bottom)
      if (ballY >= 1 || ballY <= -1) {
        ballYDirection = -ballYDirection;
      }

      // --- PADDLE COLLISION LOGIC ---

      // 4. Player Hit (Left)
      // Widen the hit box slightly (-0.9 to -1.0) to prevent "phasing through" at high speeds
      if (ballX <= -0.9 &&
          ballX >= -1.05 &&
          ballY >= playerY - (paddleHeight / 2) &&
          ballY <= playerY + (paddleHeight / 2)) {
        // Only bounce if moving left
        if (ballXDirection < 0) {
          ballXDirection = -ballXDirection;
          _increaseSpeed(); // 🚀 SPEED UP
        }
      }

      // 5. AI Hit (Right)
      if (ballX >= 0.9 &&
          ballX <= 1.05 &&
          ballY >= aiY - (paddleHeight / 2) &&
          ballY <= aiY + (paddleHeight / 2)) {
        // Only bounce if moving right
        if (ballXDirection > 0) {
          ballXDirection = -ballXDirection;
          _increaseSpeed(); // 🚀 SPEED UP
        }
      }

      // 6. Scoring / Game Over
      if (ballX < -1.1) {
        // AI Scored -> YOU FAILED -> HIRE ME
        _gameOver(false);
      } else if (ballX > 1.1) {
        // You Scored -> Point + Reset Ball
        playerScore++;
        _resetBall();
      }
    });
  }

  void _increaseSpeed() {
    // INCREASE SPEED BY 15% ON EVERY HIT (x1.15)
    ballXDirection *= 1.15;
    ballYDirection *= 1.15;

    // Cap max speed so it doesn't break the physics engine (teleporting)
    if (ballXDirection.abs() > 0.15) {
      ballXDirection = ballXDirection > 0 ? 0.15 : -0.15;
    }
  }

  void _onPanUpdate(DragUpdateDetails details) {
    double screenHeight = MediaQuery.of(context).size.height;
    setState(() {
      // Increased sensitivity (2.5) for faster paddle movement
      playerY += (details.delta.dy * 2.5) / (screenHeight / 2);
      if (playerY > 0.9) playerY = 0.9;
      if (playerY < -0.9) playerY = -0.9;
    });
  }

  void _gameOver(bool didWin) {
    _gameLoopController.stop();
    setState(() => gameStarted = false);
    _showHireMeDialog();
  }

  void _showHireMeDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF2C2C2C),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Column(
            children: [
              Icon(
                Icons.warning_amber_rounded,
                color: Colors.orangeAccent,
                size: 50,
              ),
              SizedBox(height: 10),
              Text(
                "GAME OVER",
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Score: $playerScore",
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                "That got fast, didn't it?",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white70, fontSize: 16),
              ),
              const SizedBox(height: 10),
              const Text(
                "I build high-performance apps that handle speed and scale.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.purpleAccent,
                  fontStyle: FontStyle.italic,
                  fontSize: 15,
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _startGame();
              },
              child: const Text(
                "Try Again",
                style: TextStyle(color: Colors.grey),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ContactScreen(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00E676),
              ),
              child: const Text(
                "Hire Me",
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text("Hyper Pong"),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: GestureDetector(
        behavior: HitTestBehavior.opaque, // Catch touches everywhere
        onPanUpdate: _onPanUpdate,
        child: Stack(
          children: [
            // CENTER LINE
            const Align(
              alignment: Alignment(0, 0),
              child: VerticalDivider(color: Colors.white10, thickness: 2),
            ),

            // SCOREBOARD
            Align(
              alignment: const Alignment(0, -0.85),
              child: Text(
                "$playerScore  -  $aiScore",
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 50,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'monospace',
                ),
              ),
            ),

            // INSTRUCTIONS / START BUTTON
            if (!gameStarted)
              Align(
                alignment: const Alignment(0, 0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      "DRAG SCREEN TO MOVE",
                      style: TextStyle(color: Colors.white54, letterSpacing: 2),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton.icon(
                      onPressed: _startGame,
                      icon: const Icon(Icons.bolt),
                      label: const Text("START FAST GAME"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orangeAccent,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 30,
                          vertical: 15,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

            // BALL
            Align(
              alignment: Alignment(ballX, ballY),
              child: Container(
                width: 20, // Slightly bigger ball for visibility
                height: 20,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      // UPDATED HERE:
                      color: Colors.white.withValues(alpha: 0.5),
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
              ),
            ),

            // PLAYER PADDLE (Left) - BIGGER
            Align(
              alignment: Alignment(-0.95, playerY),
              child: Container(
                width: MediaQuery.of(context).size.width * paddleWidth,
                height: MediaQuery.of(context).size.height * paddleHeight,
                decoration: BoxDecoration(
                  color: Colors.cyanAccent,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      // UPDATED HERE:
                      color: Colors.cyanAccent.withValues(alpha: 0.4),
                      blurRadius: 10,
                    ),
                  ],
                ),
              ),
            ),

            // AI PADDLE (Right) - BIGGER
            Align(
              alignment: Alignment(0.95, aiY),
              child: Container(
                width: MediaQuery.of(context).size.width * paddleWidth,
                height: MediaQuery.of(context).size.height * paddleHeight,
                decoration: BoxDecoration(
                  color: Colors.redAccent,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      // UPDATED HERE:
                      color: Colors.redAccent.withValues(alpha: 0.4),
                      blurRadius: 10,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
