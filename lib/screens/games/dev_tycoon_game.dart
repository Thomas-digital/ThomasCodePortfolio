import 'dart:async';
import 'package:flutter/material.dart';

class DevTycoonGame extends StatefulWidget {
  const DevTycoonGame({super.key});

  @override
  State<DevTycoonGame> createState() => _DevTycoonGameState();
}

class _DevTycoonGameState extends State<DevTycoonGame> with TickerProviderStateMixin {
  int linesOfCode = 0;
  int linesPerClick = 1;
  int autoCodePerSecond = 0;
  Timer? _autoCoder;
  late AnimationController _iconController;

  final List<GameUpgrade> upgrades = [
    GameUpgrade(id: 1, name: "Drink Coffee", cost: 50, autoRate: 1, clickBoost: 0, icon: Icons.coffee),
    GameUpgrade(id: 2, name: "Mech Keyboard", cost: 200, autoRate: 0, clickBoost: 2, icon: Icons.keyboard),
    GameUpgrade(id: 3, name: "Hire Intern", cost: 1000, autoRate: 5, clickBoost: 0, icon: Icons.person_add),
    GameUpgrade(id: 4, name: "Copilot AI", cost: 5000, autoRate: 20, clickBoost: 0, icon: Icons.smart_toy),
  ];

  @override
  void initState() {
    super.initState();
    _autoCoder = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (autoCodePerSecond > 0) {
        setState(() => linesOfCode += autoCodePerSecond);
      }
    });
    _iconController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      lowerBound: 0.9,
      upperBound: 1.0,
    );
  }

  @override
  void dispose() {
    _autoCoder?.cancel();
    _iconController.dispose();
    super.dispose();
  }

  void _tapToCode() {
    setState(() => linesOfCode += linesPerClick);
    _iconController.forward().then((_) => _iconController.reverse());
  }

  void _buyUpgrade(GameUpgrade item) {
    if (linesOfCode >= item.cost) {
      setState(() {
        linesOfCode -= item.cost;
        autoCodePerSecond += item.autoRate;
        linesPerClick += item.clickBoost;
        item.cost = (item.cost * 1.5).round();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Bought ${item.name}!"), duration: const Duration(milliseconds: 500), backgroundColor: Colors.green),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        title: const Text("Dev Tycoon"),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: Column(
        children: [
          // SCOREBOARD
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            color: const Color(0xFF1E1E1E),
            child: Column(
              children: [
                Text("$linesOfCode LOC", style: const TextStyle(color: Colors.cyanAccent, fontSize: 40, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                Text("$autoCodePerSecond lines / sec", style: const TextStyle(color: Colors.greenAccent)),
              ],
            ),
          ),
          // CLICK AREA
          Expanded(
            child: Center(
              child: GestureDetector(
                onTap: _tapToCode,
                child: ScaleTransition(
                  scale: _iconController,
                  child: Container(
                    width: 180,
                    height: 180,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFF2C2C2C),
                      border: Border.all(color: Colors.cyanAccent, width: 4),
                      boxShadow: [BoxShadow(color: Colors.cyanAccent.withValues(alpha: 0.4), blurRadius: 30)],
                    ),
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.code, size: 60, color: Colors.white),
                        SizedBox(height: 5),
                        Text("TAP TO CODE", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          // SHOP
          Expanded(
            child: ListView.builder(
              itemCount: upgrades.length,
              itemBuilder: (context, index) {
                final item = upgrades[index];
                final canAfford = linesOfCode >= item.cost;
                return ListTile(
                  leading: Icon(item.icon, color: Colors.purpleAccent),
                  title: Text(item.name, style: const TextStyle(color: Colors.white)),
                  subtitle: Text("Cost: ${item.cost} LOC", style: const TextStyle(color: Colors.grey)),
                  trailing: ElevatedButton(
                    onPressed: canAfford ? () => _buyUpgrade(item) : null,
                    style: ElevatedButton.styleFrom(backgroundColor: canAfford ? const Color(0xFF00E676) : Colors.grey.shade800),
                    child: const Text("Buy"),
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

class GameUpgrade {
  final int id;
  final String name;
  int cost;
  final int autoRate;
  final int clickBoost;
  final IconData icon;
  GameUpgrade({required this.id, required this.name, required this.cost, required this.autoRate, required this.clickBoost, required this.icon});
}