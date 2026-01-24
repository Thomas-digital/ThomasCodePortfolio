import 'dart:async';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class MemoryLeakGame extends StatefulWidget {
  const MemoryLeakGame({super.key});

  @override
  State<MemoryLeakGame> createState() => _MemoryLeakGameState();
}

class _MemoryLeakGameState extends State<MemoryLeakGame> {
  // --- SETTINGS ---
  // 6 Pairs = 12 Cards
  final List<IconData> _icons = [
    Icons.bug_report,
    Icons.memory,
    Icons.wifi,
    Icons.storage,
    Icons.security,
    Icons.code,
    Icons.bug_report,
    Icons.memory,
    Icons.wifi,
    Icons.storage,
    Icons.security,
    Icons.code,
  ];

  // --- STATE ---
  List<bool> _cardFlips = [];
  List<bool> _cardMatched = [];
  int _previousIndex = -1;
  bool _isProcessing = false; // Prevent tapping while animating
  int _moves = 0;
  
  @override
  void initState() {
    super.initState();
    _restartGame();
  }

  void _restartGame() {
    setState(() {
      _icons.shuffle(); // Shuffle the cards
      _cardFlips = List.generate(12, (index) => false); // All face down
      _cardMatched = List.generate(12, (index) => false); // None matched
      _previousIndex = -1;
      _moves = 0;
      _isProcessing = false;
    });
  }

  void _onCardTap(int index) {
    // Ignore taps if processing, already flipped, or matched
    if (_isProcessing || _cardFlips[index] || _cardMatched[index]) return;

    setState(() {
      _cardFlips[index] = true; // Flip current card
    });

    if (_previousIndex == -1) {
      // First card of the pair
      _previousIndex = index;
    } else {
      // Second card of the pair
      _moves++;
      _isProcessing = true; // Block input
      
      if (_icons[index] == _icons[_previousIndex]) {
        // MATCH!
        setState(() {
          _cardMatched[index] = true;
          _cardMatched[_previousIndex] = true;
          _previousIndex = -1;
          _isProcessing = false;
        });
        _checkWin();
      } else {
        // NO MATCH - Wait 1 sec then flip back
        Future.delayed(const Duration(milliseconds: 1000), () {
          if (mounted) {
            setState(() {
              _cardFlips[index] = false;
              _cardFlips[_previousIndex] = false;
              _previousIndex = -1;
              _isProcessing = false;
            });
          }
        });
      }
    }
  }

  void _checkWin() {
    if (_cardMatched.every((element) => element == true)) {
      // All matched!
      Future.delayed(const Duration(milliseconds: 500), _showHireMeDialog);
    }
  }

  // --- HIRE ME DIALOG ---
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
              Icon(Icons.check_circle_outline, color: Colors.greenAccent, size: 50),
              SizedBox(height: 10),
              Text("MEMORY OPTIMIZED!", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("You cleared the leak in $_moves moves.", style: const TextStyle(color: Colors.grey)),
              const SizedBox(height: 20),
              const Text(
                "You have excellent attention to detail.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
              const SizedBox(height: 10),
              const Text(
                "I specialize in writing clean, optimized code. Hire me to speed up your next project!",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.purpleAccent, fontStyle: FontStyle.italic),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _restartGame();
              },
              child: const Text("Play Again", style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              onPressed: () async {
                 final Uri url = Uri.parse("https://wa.me/2349131564197"); // Your WhatsApp
                 if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00E676)),
              child: const Text("Hire Me", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
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
        title: const Text("Memory Leak"),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _restartGame,
          )
        ],
      ),
      body: Column(
        children: [
          // SCOREBOARD
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.touch_app, color: Colors.purpleAccent),
                const SizedBox(width: 10),
                Text("Moves: $_moves", style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
          ),

          // GRID
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3, // 3 Columns
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 0.8,
              ),
              itemCount: 12,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () => _onCardTap(index),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                    decoration: BoxDecoration(
                      color: _cardFlips[index] || _cardMatched[index] 
                          ? Colors.purpleAccent 
                          : const Color(0xFF1E1E1E),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _cardFlips[index] || _cardMatched[index] 
                            ? Colors.white 
                            : Colors.purpleAccent.withValues(alpha: 0.3),
                      ),
                      boxShadow: [
                         BoxShadow(
                           color: _cardFlips[index] 
                              ? Colors.purple.withValues(alpha: 0.5) 
                              : Colors.black26,
                           blurRadius: 8,
                         )
                      ],
                    ),
                    child: Center(
                      child: _cardFlips[index] || _cardMatched[index]
                          ? Icon(_icons[index], size: 40, color: Colors.white)
                          : const Icon(Icons.help_outline, size: 40, color: Colors.grey),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}