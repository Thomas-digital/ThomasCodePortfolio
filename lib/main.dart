import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart'; 
import 'screens/projects_screen.dart';
import 'screens/insights_screen.dart';
import 'screens/animations_screen.dart';
import 'screens/contact_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Thomas Code Portfolio',
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.purple,
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFF121212),
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const ProjectsScreen(),   // Loads from lib/screens/projects_screen.dart
    const InsightsScreen(),   
    const AnimationsScreen(), 
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // --- APP BAR WITH NEON FRAKTUR TITLE ---
      appBar: AppBar(
        centerTitle: false,
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: RichText(
          text: TextSpan(
            style: GoogleFonts.unifrakturMaguntia(
              fontSize: 32, 
            ),
            children: [
              // 1. "Code" - CYAN NEON
              const TextSpan(
                text: "Code",
                style: TextStyle(
                  color: Colors.cyanAccent,
                  shadows: [
                    Shadow(color: Colors.blue, blurRadius: 20),
                    Shadow(color: Colors.cyanAccent, blurRadius: 5),
                  ],
                ),
              ),
              // 2. "With" - Subtle White
              TextSpan(
                text: " With ",
                style: GoogleFonts.rye(
                  fontSize: 20,
                  color: Colors.white54,
                ),
              ),
              // 3. "Thomas" - PINK NEON
              TextSpan(
                text: "Thomas",
                style: TextStyle(
                  color: const Color(0xFFE040FB),
                  shadows: [
                    Shadow(
                      // Using the new .withValues() as requested
                      color: const Color(0xFFE040FB).withValues(alpha: 0.6),
                      blurRadius: 20,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ContactScreen(),
                  ),
                );
              },
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.pinkAccent, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.pink.withValues(alpha: 0.5),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: const CircleAvatar(
                  backgroundColor: Color(0xFF1E1E1E),
                  child: Icon(Icons.person, color: Colors.cyanAccent),
                ),
              ),
            ),
          ),
        ],
      ),
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (int index) {
          setState(() {
            _currentIndex = index;
          });
        },
        backgroundColor: const Color(0xFF1E1E1E),
        indicatorColor: const Color(0xFFBB86FC),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.work_outline),
            selectedIcon: Icon(Icons.work),
            label: 'Projects',
          ),
          NavigationDestination(
            icon: Icon(Icons.lightbulb_outline),
            selectedIcon: Icon(Icons.lightbulb),
            label: 'Insights',
          ),
          NavigationDestination(
            icon: Icon(Icons.animation),
            selectedIcon: Icon(Icons.movie_filter),
            label: 'Playground',
          ),
        ],
      ),
    );
  }
}