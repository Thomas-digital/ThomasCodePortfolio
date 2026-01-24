import 'dart:async';
import 'dart:math'; // Required for random insults
import 'package:flutter/material.dart';
import '../contact_screen.dart'; // Ensure this path is correct for your project

class LogicQuizGame extends StatefulWidget {
  const LogicQuizGame({super.key});

  @override
  State<LogicQuizGame> createState() => _LogicQuizGameState();
}

class _LogicQuizGameState extends State<LogicQuizGame> {
  int score = 0;
  int streak = 0;
  int currentIndex = 0;
  bool quizFinished = false;
  bool interactionsEnabled = true;

  List<Map<String, dynamic>> activeQuestions = [];

  // --- THE VAULT (Full List) ---
  final List<Map<String, dynamic>> questionVault = [
    // --- EXISTING QUESTIONS ---
    {
      "q": "SQL stands for 'Structured Query Language'.",
      "a": true,
      "e": "Standard for relational DBs.",
    },
    {
      "q": "HTML is a programming language.",
      "a": false,
      "e": "It's a Markup Language.",
    },
    {
      "q": "In Git, 'pull' combines 'fetch' and 'merge'.",
      "a": true,
      "e": "Retrieves and merges changes.",
    },
    {
      "q": "Python is a 'low-level' language.",
      "a": false,
      "e": "Python is high-level.",
    },
    {
      "q": "JSON stands for JavaScript Object Notation.",
      "a": true,
      "e": "Standard data format.",
    },
    {
      "q": "In Flutter, 'setState()' rebuilds the entire App.",
      "a": false,
      "e": "Rebuilds only the widget.",
    },
    {
      "q": "A 'Column' widget arranges children horizontally.",
      "a": false,
      "e": "Column is Vertical.",
    },
    {
      "q": "Hot Reload preserves the app state.",
      "a": true,
      "e": "Injects code without resetting.",
    },
    {
      "q": "Dart is developed by Facebook.",
      "a": false,
      "e": "Dart is developed by Google.",
    },
    {
      "q": "Everything in Flutter is a Widget.",
      "a": true,
      "e": "Layout, style, structure.",
    },
    {
      "q": "HTTP Status 404 means 'Unauthorized'.",
      "a": false,
      "e": "404 is Not Found.",
    },
    {
      "q": "HTTP Status 500 means 'Server Error'.",
      "a": true,
      "e": "Server failed to fulfill request.",
    },
    {
      "q": "CSS stands for 'Creative Style Sheets'.",
      "a": false,
      "e": "Cascading Style Sheets.",
    },
    {
      "q": "JavaScript and Java are the same.",
      "a": false,
      "e": "Completely different languages.",
    },
    {
      "q": "A Primary Key in SQL must be unique.",
      "a": true,
      "e": "Identifies unique records.",
    },
    {
      "q": "Binary Search is faster than Linear Search.",
      "a": true,
      "e": "O(log n) vs O(n).",
    },
    {
      "q": "A Stack uses FIFO logic.",
      "a": false,
      "e": "Stack is LIFO. Queue is FIFO.",
    },
    {"q": "1 byte equals 8 bits.", "a": true, "e": "Standard digital unit."},
    {
      "q": "Arrays have a fixed size in Java.",
      "a": true,
      "e": "Size cannot change once created.",
    },
    {
      "q": "Recursion is a function calling itself.",
      "a": true,
      "e": "Divide-and-conquer method.",
    },
    {"q": "HTTPS encrypts data.", "a": true, "e": "Uses TLS/SSL security."},
    {
      "q": "Plain text passwords are safe.",
      "a": false,
      "e": "Always hash and salt passwords.",
    },
    {
      "q": "Docker is used for containerization.",
      "a": true,
      "e": "Packages apps in containers.",
    },
    {
      "q": "SaaS stands for 'Software as a Service'.",
      "a": true,
      "e": "Like Gmail or Slack.",
    },
    {
      "q": "A VPN hides your IP address.",
      "a": true,
      "e": "Routes traffic through a tunnel.",
    },
    {
      "q": "Race Conditions happen in single-threaded apps.",
      "a": false,
      "e": "Occurs in multi-threaded apps.",
    },
    {
      "q": "GraphQL prevents over-fetching.",
      "a": true,
      "e": "Request only what you need.",
    },
    {
      "q": "NoSQL databases use tables/rows.",
      "a": false,
      "e": "They use documents/keys.",
    },
    {
      "q": "Big O Notation measures readability.",
      "a": false,
      "e": "Measures complexity.",
    },
    {
      "q": "SOLID is a set of design principles.",
      "a": true,
      "e": "OOP best practices.",
    },

    // --- GENERAL CODING KNOWLEDGE ---
    {
      "q": "The first computer bug was an actual moth.",
      "a": true,
      "e": "Found in the Mark II in 1947.",
    },
    {
      "q": "Linux is an open-source operating system.",
      "a": true,
      "e": "Created by Linus Torvalds.",
    },
    {
      "q": "RAM stands for Random Access Memory.",
      "a": true,
      "e": "It is volatile memory.",
    },
    {
      "q": "IPv4 addresses are 128-bit.",
      "a": false,
      "e": "IPv4 is 32-bit; IPv6 is 128-bit.",
    },
    {
      "q": "Ada Lovelace is considered the first programmer.",
      "a": true,
      "e": "She wrote an algorithm for the Analytical Engine.",
    },
    {
      "q": "'Phishing' is a type of water sport.",
      "a": false,
      "e": "It is a cyber attack method.",
    },
    {
      "q": "Ctrl + Z is the universal shortcut for 'Undo'.",
      "a": true,
      "e": "Ctrl + Y is usually 'Redo'.",
    },
    {
      "q": "Google was originally named 'BackRub'.",
      "a": true,
      "e": "Rebranded to Google in 1997.",
    },
    {
      "q": "Python is named after the snake.",
      "a": false,
      "e": "Named after Monty Python's Flying Circus.",
    },
    {
      "q": "A 'Bit' is smaller than a 'Byte'.",
      "a": true,
      "e": "8 bits make 1 byte.",
    },
    {
      "q": "C++ is an older language than C.",
      "a": false,
      "e": "C came first (1972), then C++ (1985).",
    },
    {
      "q": "AWS stands for Amazon Web Services.",
      "a": true,
      "e": "Cloud computing platform.",
    },
    {
      "q": "Blue Screen of Death (BSOD) is a macOS feature.",
      "a": false,
      "e": "It is iconic to Windows.",
    },
    {
      "q": "WiFi stands for 'Wireless Fidelity'.",
      "a": false,
      "e": "It's a common misconception; it stands for nothing.",
    },
    {
      "q": "SSD drives are faster than HDD.",
      "a": true,
      "e": "No moving parts in SSDs.",
    },
    {
      "q": "A 'Trojan' is a helpful virus.",
      "a": false,
      "e": "It is malware disguised as legitimate software.",
    },
    {
      "q": "URL stands for Uniform Resource Locator.",
      "a": true,
      "e": "Address of a web resource.",
    },
    {
      "q": "Assembly language is high-level.",
      "a": false,
      "e": "It is very low-level machine code.",
    },
    {
      "q": "GitHub and Git are the same thing.",
      "a": false,
      "e": "Git is the tool, GitHub is the hosting service.",
    },
    {
      "q": "Android is based on the Linux kernel.",
      "a": true,
      "e": "Modified for mobile devices.",
    },
    {
      "q": "Tim Berners-Lee invented the World Wide Web.",
      "a": true,
      "e": "He proposed it in 1989.",
    },
    {
      "q": "JPEG is a format for audio files.",
      "a": false,
      "e": "JPEG is for images.",
    },
    {
      "q": "Variables in 'const' can be changed later.",
      "a": false,
      "e": "Const variables are immutable.",
    },
    {
      "q": "DNS translates domain names to IP addresses.",
      "a": true,
      "e": "Like a phonebook for the internet.",
    },
    {
      "q": "The 'Cloud' is actually just other people's computers.",
      "a": true,
      "e": "Servers in data centers.",
    },
    {
      "q": "Moore's Law is about legal software rights.",
      "a": false,
      "e": "It predicts transistor counts doubling.",
    },
    {
      "q": "Java code is compiled into Bytecode.",
      "a": true,
      "e": "Runs on the JVM.",
    },
    {
      "q": "API stands for Application Programming Interface.",
      "a": true,
      "e": "Allows apps to talk to each other.",
    },
    {
      "q": "Open Source software is always free of cost.",
      "a": false,
      "e": "Usually free, but refers to source accessibility.",
    },
    {
      "q": "Incognito mode hides you from your ISP.",
      "a": false,
      "e": "Only hides history on your local device.",
    },
    {
      "q": "A Terabyte is 1024 Gigabytes.",
      "a": true,
      "e": "In binary calculation (TiB vs TB varies).",
    },
    {
      "q": "ASCII is a character encoding standard.",
      "a": true,
      "e": "Represents text in computers.",
    },
    {
      "q": "The first iPhone was released in 2005.",
      "a": false,
      "e": "It was 2007.",
    },
    {
      "q": "CPU is the 'Brain' of the computer.",
      "a": true,
      "e": "Central Processing Unit.",
    },
    {
      "q": "IoT stands for Internet of Time.",
      "a": false,
      "e": "Internet of Things.",
    },
    {
      "q": "Mark Zuckerberg created Twitter.",
      "a": false,
      "e": "He created Facebook. Jack Dorsey created Twitter.",
    },
    {
      "q": "Swift is the primary language for iOS today.",
      "a": true,
      "e": "Replaced Objective-C.",
    },
    {
      "q": "Kotlin is the official language for Android.",
      "a": true,
      "e": "Google announced this in 2017.",
    },
    {
      "q": "A 'Pixel' is a programming loop.",
      "a": false,
      "e": "It's the smallest unit of an image.",
    },
    {
      "q": "Firewalls protect networks from unauthorized access.",
      "a": true,
      "e": "Acts as a security barrier.",
    },
    {
      "q": "VPNs are illegal.",
      "a": false,
      "e": "Legal in most countries, used for privacy.",
    },
    {
      "q": "CAPTCHA is used to distinguish humans from bots.",
      "a": true,
      "e": "Completely Automated Public Turing test.",
    },
    {
      "q": "BIOS runs before the Operating System.",
      "a": true,
      "e": "Basic Input/Output System.",
    },
    {
      "q": "GPU is used mainly for spreadsheets.",
      "a": false,
      "e": "Graphics Processing Unit (Gaming/Rendering).",
    },
    {
      "q": "Spam email is named after the meat product.",
      "a": true,
      "e": "From a Monty Python sketch.",
    },
    {
      "q": "QR Code stands for Quick Response Code.",
      "a": true,
      "e": "Invented in Japan for car parts.",
    },
    {
      "q": "Incognito Mode prevents viruses.",
      "a": false,
      "e": "It offers no security protection.",
    },
    {
      "q": "Apple was founded in a garage.",
      "a": true,
      "e": "Steve Jobs' parents' garage.",
    },
    {
      "q": "4G is faster than 5G.",
      "a": false,
      "e": "5G is the newer, faster generation.",
    },
    {
      "q": "GUI stands for Graphical User Interface.",
      "a": true,
      "e": "Interaction via icons, not text.",
    },
    {
      "q": "Steve Jobs wrote the code for macOS.",
      "a": false,
      "e": "He was the visionary, not the engineer.",
    },
    {
      "q": "A 'Cookie' tracks user activity on websites.",
      "a": true,
      "e": "Small data file stored on the client.",
    },
    {"q": "Mp3 is a video format.", "a": false, "e": "It is an audio format."},
    {
      "q": "Algorithms are cooking recipes for computers.",
      "a": true,
      "e": "Step-by-step instructions.",
    },
    {
      "q": "A 'Ping' measures latency.",
      "a": true,
      "e": "Time for data to travel and return.",
    },
    {
      "q": "Ctrl + C is 'Cut'.",
      "a": false,
      "e": "Ctrl + C is Copy. Ctrl + X is Cut.",
    },
    {
      "q": "RAM data is lost when power turns off.",
      "a": true,
      "e": "It is volatile memory.",
    },
    {
      "q": "A 'Bug' is an unexpected feature.",
      "a": false,
      "e": "It is an error or flaw.",
    },
    {
      "q": "Encryption makes data readable to everyone.",
      "a": false,
      "e": "It scrambles data for security.",
    },
    {
      "q": "Blockchain is only used for Bitcoin.",
      "a": false,
      "e": "Used for contracts, supply chain, etc.",
    },
  ];

  final List<String> respectableInsults = [
    "That logic wouldn't pass my code review.",
    "A merge conflict is less painful than that answer.",
    "My compiler is judging you right now.",
    "404: Correct Answer Not Found. Need a dev?",
    "That's a bug, not a feature.",
    "I write cleaner loops than that thought process.",
    "Did you copy-paste that answer from StackOverflow?",
    "Even my 'Hello World' program knows better.",
    "That answer just crashed the server.",
    "You need a Lead Developer. Fortunately, I'm right here.",
    "Have you tried turning your brain off and on again?",
    "I've seen better logic in a spaghetti code.",
  ];

  @override
  void initState() {
    super.initState();
    _startNewRound();
  }

  void _startNewRound() {
    setState(() {
      score = 0;
      streak = 0;
      currentIndex = 0;
      quizFinished = false;
      interactionsEnabled = true;
      questionVault.shuffle();
      activeQuestions = questionVault.take(5).toList();
    });
  }

  void _answerQuestion(bool userChoice) {
    if (!interactionsEnabled) return;
    setState(() {
      interactionsEnabled = false;
    });

    bool correctAnswer = activeQuestions[currentIndex]['a'];

    if (userChoice == correctAnswer) {
      score++;
      streak++;
      _showFeedback(true);
    } else {
      streak = 0;
      _showFeedback(false);
    }
  }

  void _showFeedback(bool isCorrect) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();

    // Check if this is the last question BEFORE showing feedback
    bool isLastQuestion = currentIndex == activeQuestions.length - 1;

    String message;
    Color color;
    SnackBarAction? action;

    if (isCorrect) {
      message = "Correct! ✅ (Streak: $streak)";
      color = Colors.green;
    } else {
      final random = Random();
      String randomInsult =
          respectableInsults[random.nextInt(respectableInsults.length)];
      message = "Wrong! ❌ $randomInsult";
      color = Colors.redAccent;

      // Only show action if NOT last question (dialog handles hiring at end)
      if (!isLastQuestion) {
        action = SnackBarAction(
          label: "HIRE EXPERT",
          textColor: Colors.white,
          backgroundColor: Colors.black26,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ContactScreen()),
            );
          },
        );
      }
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
        backgroundColor: color,
        // If last question, make snackbar disappear super fast to show dialog
        duration: Duration(milliseconds: isLastQuestion ? 400 : 800),
        action: action,
      ),
    );

    // If it's the last question, delay is minimal (essentially instant)
    // If not, wait 900ms for user to see feedback
    int delayTime = isLastQuestion ? 400 : 900;

    Future.delayed(Duration(milliseconds: delayTime), () {
      if (mounted) {
        if (isLastQuestion) {
          // IMMEDIATE END GAME
          ScaffoldMessenger.of(context).hideCurrentSnackBar(); // Clean up
          setState(() {
            quizFinished = true;
            _showScoreDialog();
          });
        } else {
          // NEXT QUESTION
          setState(() {
            currentIndex++;
            interactionsEnabled = true;
          });
        }
      }
    });
  }

  void _showScoreDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        bool isWinner = score >= 4;
        String titleText = isWinner ? "EXPERT LEVEL!" : "NEEDS OPTIMIZATION";

        return AlertDialog(
          backgroundColor: const Color(0xFF2C2C2C),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Column(
            children: [
              Icon(
                isWinner ? Icons.emoji_events : Icons.warning_amber_rounded,
                color: isWinner ? Colors.amber : Colors.orangeAccent,
                size: 50,
              ),
              const SizedBox(height: 10),
              Text(
                titleText,
                style: const TextStyle(
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
                "Score: $score / 5",
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                isWinner
                    ? "You know your stuff. We speak the same language."
                    : "Coding is hard. Why not hire an expert to do it for you?",
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white70, fontSize: 16),
              ),
              const SizedBox(height: 10),
              const Text(
                "I deliver clean, bug-free apps. Let's work together.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.purpleAccent,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _startNewRound();
              },
              child: const Text(
                "Rematch",
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
    if (activeQuestions.isEmpty) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        title: const Text("Logic Gate Quiz"),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 20.0),
              child: Text(
                "Score: $score",
                style: const TextStyle(
                  color: Colors.purpleAccent,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
      body: quizFinished
          ? const Center(
              child: CircularProgressIndicator(color: Colors.purpleAccent),
            )
          : Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (streak > 1)
                    Text(
                      "🔥 $streak Streak! 🔥",
                      style: const TextStyle(
                        color: Colors.orangeAccent,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  const SizedBox(height: 10),

                  LinearProgressIndicator(
                    value: (currentIndex + 1) / 5,
                    backgroundColor: Colors.grey[800],
                    color: Colors.purpleAccent,
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(5),
                  ),
                  const SizedBox(height: 20),

                  Text(
                    "Question ${currentIndex + 1} / 5",
                    style: const TextStyle(color: Colors.grey, fontSize: 16),
                  ),
                  const SizedBox(height: 30),

                  Container(
                    padding: const EdgeInsets.all(30),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E1E1E),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        // FIXED: using withValues instead of withOpacity
                        color: Colors.purpleAccent.withValues(alpha: 0.3),
                      ),
                      boxShadow: [
                        BoxShadow(
                          // FIXED: using withValues instead of withOpacity
                          color: Colors.black.withValues(alpha: 0.5),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(minHeight: 100),
                      child: Center(
                        child: Text(
                          activeQuestions[currentIndex]['q'],
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            height: 1.4,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 50),

                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 60,
                          child: ElevatedButton(
                            onPressed: () => _answerQuestion(true),
                            style: ElevatedButton.styleFrom(
                              // FIXED: using withValues
                              backgroundColor: Colors.green.withValues(
                                alpha: 0.2,
                              ),
                              foregroundColor: Colors.greenAccent,
                              side: const BorderSide(color: Colors.greenAccent),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15),
                              ),
                            ),
                            child: const Text(
                              "TRUE",
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: SizedBox(
                          height: 60,
                          child: ElevatedButton(
                            onPressed: () => _answerQuestion(false),
                            style: ElevatedButton.styleFrom(
                              // FIXED: using withValues
                              backgroundColor: Colors.red.withValues(
                                alpha: 0.2,
                              ),
                              foregroundColor: Colors.redAccent,
                              side: const BorderSide(color: Colors.redAccent),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15),
                              ),
                            ),
                            child: const Text(
                              "FALSE",
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
    );
  }
}
