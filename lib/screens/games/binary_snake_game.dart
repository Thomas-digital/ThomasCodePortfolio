import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart'; // To open WhatsApp/Email

class BinarySnakeGame extends StatefulWidget {
  const BinarySnakeGame({super.key});

  @override
  State<BinarySnakeGame> createState() => _BinarySnakeGameState();
}

enum Direction { up, down, left, right }

class _BinarySnakeGameState extends State<BinarySnakeGame> {
  // --- SETTINGS ---
  final int rowSize = 20;
  final int totalSquares = 400;
  final Duration speed = const Duration(milliseconds: 200);

  // --- STATE ---
  List<int> snakePos = [0, 1, 2]; // Initial snake body positions
  int foodPos = 155;
  Direction currentDirection = Direction.right;
  bool gameHasStarted = false;
  int score = 0;
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void startGame() {
    setState(() {
      gameHasStarted = true;
      snakePos = [0, 1, 2];
      score = 0;
      currentDirection = Direction.right;
    });
    _timer = Timer.periodic(speed, (timer) {
      updateSnake();
    });
  }

  void updateSnake() {
    setState(() {
      // 1. Calculate new head
      int newHead = snakePos.last;
      switch (currentDirection) {
        case Direction.down:
          newHead += rowSize;
          break;
        case Direction.up:
          newHead -= rowSize;
          break;
        case Direction.right:
          newHead += 1;
          break;
        case Direction.left:
          newHead -= 1;
          break;
      }

      // 2. Check Game Over (Wall Crash or Self Crash)
      if (checkCollision(newHead)) {
        gameOver();
        return;
      }

      // 3. Move Snake
      snakePos.add(newHead);

      // 4. Eat Food
      if (snakePos.last == foodPos) {
        score++;
        // Generate new food that isn't on the snake
        while (snakePos.contains(foodPos)) {
          foodPos = Random().nextInt(totalSquares);
        }
      } else {
        // Remove tail if we didn't eat
        snakePos.removeAt(0);
      }
    });
  }

  bool checkCollision(int pos) {
    // 1. Wall Collision check
    if (pos < 0 || pos >= totalSquares) return true; // Top/Bottom
    
    // Left/Right wrap-around prevention logic
    if (currentDirection == Direction.right && pos % rowSize == 0) return true;
    if (currentDirection == Direction.left && (pos + 1) % rowSize == 0) return true;

    // 2. Self Collision
    if (snakePos.contains(pos)) return true;

    return false;
  }

  void gameOver() {
    _timer?.cancel();
    setState(() {
      gameHasStarted = false;
    });
    _showHireMeDialog();
  }

  // --- THE "HIRE ME" MARKETING HOOK ---
  void _showHireMeDialog() {
    showDialog(
      context: context,
      barrierDismissible: false, // Force them to interact
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF2C2C2C),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Column(
            children: [
              Icon(Icons.error_outline, color: Colors.redAccent, size: 50),
              SizedBox(height: 10),
              Text("CRASHED!", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("You scored $score points.", style: const TextStyle(color: Colors.grey)),
              const SizedBox(height: 20),
              const Text(
                "Don't let your next project crash like this snake.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
              const SizedBox(height: 10),
              const Text(
                "Hire Thomas to build robust, bug-free applications.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.purpleAccent, fontStyle: FontStyle.italic),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Close dialog
                startGame(); // Restart
              },
              child: const Text("Try Again", style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              onPressed: () async {
                 final Uri url = Uri.parse("https://wa.me/2349131564197"); // Your WhatsApp
                 if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00E676)),
              child: const Text("Hire Me Now", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
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
        title: const Text("Binary Snake"),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          // SCORE
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Score: $score", style: const TextStyle(color: Colors.white, fontSize: 20)),
                if (!gameHasStarted) 
                  const Text("Tap arrow to Start", style: TextStyle(color: Colors.greenAccent)),
              ],
            ),
          ),

          // GRID
          Expanded(
            child: GestureDetector(
              // Swipe Controls
              onVerticalDragUpdate: (details) {
                if (details.delta.dy > 0 && currentDirection != Direction.up) {
                  currentDirection = Direction.down;
                } else if (details.delta.dy < 0 && currentDirection != Direction.down) {
                  currentDirection = Direction.up;
                }
              },
              onHorizontalDragUpdate: (details) {
                if (details.delta.dx > 0 && currentDirection != Direction.left) {
                  currentDirection = Direction.right;
                } else if (details.delta.dx < 0 && currentDirection != Direction.right) {
                  currentDirection = Direction.left;
                }
              },
              child: GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                itemCount: totalSquares,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: rowSize,
                ),
                itemBuilder: (context, index) {
                  if (snakePos.contains(index)) {
                    // Snake Body
                    return Container(
                      padding: const EdgeInsets.all(2),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: Container(color: Colors.greenAccent),
                      ),
                    );
                  } else if (index == foodPos) {
                    // Food (Bug)
                    return const Icon(Icons.bug_report, color: Colors.redAccent, size: 15);
                  } else {
                    // Empty Space
                    return Container(
                      margin: const EdgeInsets.all(1),
                      decoration: BoxDecoration(
                        color: Colors.grey[900],
                        borderRadius: BorderRadius.circular(2),
                      ),
                    );
                  }
                },
              ),
            ),
          ),
          
          // CONTROLS (For ease of use)
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              children: [
                IconButton(
                  onPressed: () { if(currentDirection != Direction.down) currentDirection = Direction.up; if(!gameHasStarted) startGame(); },
                  icon: const Icon(Icons.keyboard_arrow_up, color: Colors.white, size: 40),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      onPressed: () { if(currentDirection != Direction.right) currentDirection = Direction.left; if(!gameHasStarted) startGame(); },
                      icon: const Icon(Icons.keyboard_arrow_left, color: Colors.white, size: 40),
                    ),
                    const SizedBox(width: 50),
                    IconButton(
                      onPressed: () { if(currentDirection != Direction.left) currentDirection = Direction.right; if(!gameHasStarted) startGame(); },
                      icon: const Icon(Icons.keyboard_arrow_right, color: Colors.white, size: 40),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () { if(currentDirection != Direction.up) currentDirection = Direction.down; if(!gameHasStarted) startGame(); },
                  icon: const Icon(Icons.keyboard_arrow_down, color: Colors.white, size: 40),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}