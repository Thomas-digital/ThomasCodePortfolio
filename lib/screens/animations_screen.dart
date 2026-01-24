import 'package:flutter/material.dart';
// Import ALL your game files
import 'games/dev_tycoon_game.dart';
import 'games/binary_snake_game.dart';
import 'games/memory_leak_game.dart';
import 'games/bug_smasher_game.dart';
import 'games/pixel_pong_game.dart';
import 'games/logic_quiz_game.dart';

class AnimationsScreen extends StatelessWidget {
  const AnimationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // List of Games - ALL LINKED NOW
    final List<Map<String, dynamic>> games = [
      {
        "title": "Dev Tycoon",
        "icon": Icons.code,
        "color": Colors.cyanAccent,
        "page": const DevTycoonGame(),
        "status": "Ready",
      },
      {
        "title": "Binary Snake",
        "icon": Icons.timeline,
        "color": Colors.greenAccent,
        "page": const BinarySnakeGame(),
        "status": "Ready",
      },
      {
        "title": "Memory Leak",
        "icon": Icons.memory,
        "color": Colors.purpleAccent,
        "page": const MemoryLeakGame(),
        "status": "Ready",
      },
      {
        "title": "Bug Smasher",
        "icon": Icons.bug_report,
        "color": Colors.redAccent,
        "page": const BugSmasherGame(),
        "status": "Ready",
      },
      {
        "title": "Pixel Pong",
        "icon": Icons.sports_tennis,
        "color": Colors.orangeAccent,
        "page": const PixelPongGame(),
        "status": "Ready",
      },
      {
        "title": "Logic Gate Quiz",
        "icon": Icons.lightbulb,
        "color": Colors.yellowAccent,
        "page": const LogicQuizGame(),
        "status": "Ready",
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        title: const Text("Arcade Playground"),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2, // 2 cards per row
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.85, // Taller cards for images
          ),
          itemCount: games.length,
          itemBuilder: (context, index) {
            final game = games[index];
            return GestureDetector(
              onTap: () {
                if (game['page'] != null) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => game['page']),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("This game is under development!"),
                    ),
                  );
                }
              },
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF1E1E1E),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: (game['color'] as Color).withValues(alpha: 0.3),
                    width: 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: (game['color'] as Color).withValues(alpha: 0.1),
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // --- GAME ICON / IMAGE PLACEHOLDER ---
                    Container(
                      height: 80,
                      width: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: (game['color'] as Color).withValues(alpha: 0.1),
                      ),
                      child: Icon(game['icon'], size: 40, color: game['color']),
                    ),

                    const SizedBox(height: 15),

                    // --- TITLE ---
                    Text(
                      game['title'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 5),

                    // --- STATUS BADGE ---
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: game['status'] == "Ready"
                            ? Colors.green.withValues(alpha: 0.2)
                            : Colors.grey.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        game['status'],
                        style: TextStyle(
                          color: game['status'] == "Ready"
                              ? Colors.green
                              : Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
