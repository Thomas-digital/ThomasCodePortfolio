import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../contact_screen.dart'; // Import your Profile Page

class BugSmasherGame extends StatefulWidget {
  const BugSmasherGame({super.key});

  @override
  State<BugSmasherGame> createState() => _BugSmasherGameState();
}

class _BugSmasherGameState extends State<BugSmasherGame> {
  // --- SETTINGS ---
  int score = 0;
  int timeLeft = 30; // 30 Seconds round
  bool gameStarted = false;
  
  // Bug Position (Alignment goes from -1.0 to 1.0)
  double bugX = 0;
  double bugY = 0;
  
  Timer? _gameTimer;
  Timer? _bugMoveTimer;
  int _moveSpeed = 800; // Milliseconds (Starts slow)

  @override
  void dispose() {
    _gameTimer?.cancel();
    _bugMoveTimer?.cancel();
    super.dispose();
  }

  void _startGame() {
    setState(() {
      score = 0;
      timeLeft = 30;
      gameStarted = true;
      _moveSpeed = 800;
    });

    // Timer for the Game Clock
    _gameTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (timeLeft > 0) {
        setState(() => timeLeft--);
      } else {
        _gameOver();
      }
    });

    // Timer to move the bug automatically if you miss it
    _startBugMovement();
  }

  void _startBugMovement() {
    _bugMoveTimer?.cancel();
    _bugMoveTimer = Timer.periodic(Duration(milliseconds: _moveSpeed), (timer) {
      _moveBug();
    });
  }

  void _moveBug() {
    setState(() {
      // Random X and Y between -0.9 and 0.9 (stay inside padding)
      bugX = (Random().nextDouble() * 1.8) - 0.9;
      bugY = (Random().nextDouble() * 1.8) - 0.9;
    });
  }

  void _onTapBug() {
    if (!gameStarted) return;
    
    setState(() {
      score++;
      // Make game harder: Speed up every 5 points
      if (score % 5 == 0 && _moveSpeed > 300) {
        _moveSpeed -= 50;
        _startBugMovement(); // Restart timer with new speed
      }
    });
    _moveBug(); // Move immediately on tap
  }

  void _gameOver() {
    _gameTimer?.cancel();
    _bugMoveTimer?.cancel();
    setState(() => gameStarted = false);
    _showHireMeDialog();
  }

  // --- THE "HIRE ME" DIALOG (Linked to Profile) ---
  void _showHireMeDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF2C2C2C),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Column(
            children: [
              Icon(Icons.bug_report, color: Colors.redAccent, size: 50),
              SizedBox(height: 10),
              Text("TIME'S UP!", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("You smashed $score bugs.", style: const TextStyle(color: Colors.grey)),
              const SizedBox(height: 20),
              const Text(
                "I squash bugs for a living.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
              const SizedBox(height: 10),
              const Text(
                "Hire me to keep your code clean and bug-free.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.purpleAccent, fontStyle: FontStyle.italic),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _startGame();
              },
              child: const Text("Try Again", style: TextStyle(color: Colors.grey)),
            ),
            
            // --- UPDATED BUTTON: GOES TO PROFILE PAGE ---
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context); // Close dialog
                // Navigate to Contact/Profile Screen
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ContactScreen()),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00E676)),
              child: const Text("View My Profile", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        title: const Text("Bug Smasher"),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: Column(
        children: [
          // HEADER: Score & Time
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("SCORE", style: TextStyle(color: Colors.grey, fontSize: 12)),
                    Text("$score", style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                  ],
                ),
                if (!gameStarted)
                   ElevatedButton.icon(
                     onPressed: _startGame, 
                     icon: const Icon(Icons.play_arrow),
                     label: const Text("START"),
                     style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                   )
                else
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text("TIME", style: TextStyle(color: Colors.grey, fontSize: 12)),
                      Text("$timeLeft", style: const TextStyle(color: Colors.redAccent, fontSize: 24, fontWeight: FontWeight.bold)),
                    ],
                  ),
              ],
            ),
          ),

          // GAME AREA
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E1E),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white10),
              ),
              child: Stack(
                children: [
                  if (gameStarted)
                    AnimatedAlign(
                      duration: Duration(milliseconds: _moveSpeed),
                      alignment: Alignment(bugX, bugY),
                      child: GestureDetector(
                        onTap: _onTapBug,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.red.withValues(alpha: 0.2),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.bug_report, color: Colors.redAccent, size: 40),
                        ),
                      ),
                    )
                  else
                    const Center(
                      child: Text(
                        "Tap START to begin!",
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}