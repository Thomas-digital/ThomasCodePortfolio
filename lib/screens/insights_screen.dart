import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// ---------------------------------------------------------
// 1. THE MODEL (Data Structure)
// ---------------------------------------------------------
class Insight {
  final String id;
  final String title;
  final String subtitle;
  final String body;
  final String iconName;
  final String createdAt;

  Insight({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.body,
    required this.iconName,
    required this.createdAt,
  });

  factory Insight.fromJson(Map<String, dynamic> json) {
    return Insight(
      id: json['id'].toString(),
      title: json['title'] ?? "Untitled Insight",
      subtitle: json['subtitle'] ?? "",
      // If body is missing in the list view, use empty string
      body: json['body'] ?? "No content available.",
      iconName: json['icon_name'] ?? "lightbulb",
      createdAt: json['created_at'] ?? "",
    );
  }
}

// ---------------------------------------------------------
// 2. THE LIST SCREEN (Insights Tab)
// ---------------------------------------------------------
class InsightsScreen extends StatefulWidget {
  const InsightsScreen({super.key});

  @override
  State<InsightsScreen> createState() => _InsightsScreenState();
}

class _InsightsScreenState extends State<InsightsScreen> {
  List<Insight> insights = [];
  bool isLoading = true;

  // ⚠️ USE 10.0.2.2 FOR ANDROID EMULATOR (Matches your XAMPP)
  final String apiUrl = "http://10.0.2.2/my_portfolio/api.php?type=insights";

  @override
  void initState() {
    super.initState();
    fetchInsights();
  }

  Future<void> fetchInsights() async {
    try {
      final response = await http.get(Uri.parse(apiUrl));

      if (response.statusCode == 200) {
        // If API returns empty or null, handle gracefully
        if (response.body.isEmpty) {
          setState(() => isLoading = false);
          return;
        }

        List<dynamic> data = json.decode(response.body);
        setState(() {
          insights = data.map((json) => Insight.fromJson(json)).toList();
          isLoading = false;
        });
      }
    } catch (e) {
      debugPrint("Error loading insights: $e");
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Colors.purpleAccent),
      );
    }

    if (insights.isEmpty) {
      return const Center(
        child: Text("No insights found.", style: TextStyle(color: Colors.grey)),
      );
    }

    return RefreshIndicator(
      onRefresh: fetchInsights,
      color: Colors.purpleAccent,
      backgroundColor: const Color(0xFF1E1E1E),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: insights.length,
        itemBuilder: (context, index) {
          final item = insights[index];

          // Get dynamic Icon & Color
          final iconData = _getIconData(item.iconName);
          final iconColor = _getIconColor(item.iconName);

          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => InsightDetailScreen(insight: item),
                ),
              );
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E1E),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // ICON CIRCLE
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: iconColor.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: iconColor.withValues(alpha: 0.5),
                      ),
                    ),
                    child: Icon(iconData, color: iconColor, size: 24),
                  ),

                  const SizedBox(width: 20),

                  // TEXT CONTENT
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          item.subtitle,
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 14,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),

                  // ARROW
                  const Icon(Icons.chevron_right, color: Colors.grey),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // --- HELPER: MAP STRINGS TO ICONS ---
  IconData _getIconData(String name) {
    switch (name) {
      case 'storage':
        return Icons.storage;
      case 'compare_arrows':
        return Icons.compare_arrows;
      case 'monetization_on':
        return Icons.monetization_on;
      case 'code':
        return Icons.code;
      default:
        return Icons.lightbulb_outline;
    }
  }

  // --- HELPER: MAP STRINGS TO COLORS ---
  Color _getIconColor(String name) {
    switch (name) {
      case 'storage':
        return const Color(0xFF03DAC6); // Teal
      case 'compare_arrows':
        return const Color(0xFFBB86FC); // Purple
      case 'monetization_on':
        return const Color(0xFFCF6679); // Pink/Red
      case 'code':
        return const Color(0xFF2979FF); // Blue
      default:
        return const Color(0xFFFFC107); // Amber
    }
  }
}

// ---------------------------------------------------------
// 3. THE DETAIL SCREEN (Reading View)
// ---------------------------------------------------------
class InsightDetailScreen extends StatelessWidget {
  final Insight insight;

  const InsightDetailScreen({super.key, required this.insight});

  @override
  Widget build(BuildContext context) {
    // Re-use logic for consistency
    final iconData = _getIconData(insight.iconName);
    final iconColor = _getIconColor(insight.iconName);

    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        title: const Text("Reading Insight"),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(25),
        child: Column(
          children: [
            // BIG HEADER ICON
            Center(
              child: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: iconColor, width: 2),
                ),
                child: Icon(iconData, color: iconColor, size: 40),
              ),
            ),

            const SizedBox(height: 25),

            // TITLE
            Text(
              insight.title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 26,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 10),

            // SUBTITLE
            Text(
              insight.subtitle,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 16,
                height: 1.5,
              ),
            ),

            const SizedBox(height: 30),
            const Divider(color: Colors.white24),
            const SizedBox(height: 30),

            // BODY TEXT
            Text(
              insight.body,
              style: const TextStyle(
                color: Color(0xFFE0E0E0),
                fontSize: 16,
                height: 1.8, // Better readability
              ),
            ),

            const SizedBox(height: 50),
          ],
        ),
      ),
    );
  }

  // --- DUPLICATE HELPERS (To ensure it works in this class too) ---
  IconData _getIconData(String name) {
    switch (name) {
      case 'storage':
        return Icons.storage;
      case 'compare_arrows':
        return Icons.compare_arrows;
      case 'monetization_on':
        return Icons.monetization_on;
      case 'code':
        return Icons.code;
      default:
        return Icons.lightbulb_outline;
    }
  }

  Color _getIconColor(String name) {
    switch (name) {
      case 'storage':
        return const Color(0xFF03DAC6);
      case 'compare_arrows':
        return const Color(0xFFBB86FC);
      case 'monetization_on':
        return const Color(0xFFCF6679);
      case 'code':
        return const Color(0xFF2979FF);
      default:
        return const Color(0xFFFFC107);
    }
  }
}