import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../models/project_model.dart';
// import 'api_config.dart'; // Uncomment this if you are using the Config file we made earlier

class ProjectDetailScreen extends StatefulWidget {
  final Project project;

  const ProjectDetailScreen({super.key, required this.project});

  @override
  State<ProjectDetailScreen> createState() => _ProjectDetailScreenState();
}

class _ProjectDetailScreenState extends State<ProjectDetailScreen> {
  String? fullContext;
  bool isLoading = true;

  // ⚠️ Ensure this matches your API setup (Use 10.0.2.2 for Android Emulator)
  final String apiUrl = "http://10.0.2.2/my_portfolio/api.php";

  // Helper to get base URL for relative downloads (like 'app-release.apk')
  String get baseUrl => apiUrl.replaceAll("/api.php", "");

  @override
  void initState() {
    super.initState();
    fetchFullDetails();
  }

  Future<void> fetchFullDetails() async {
    try {
      final response = await http.get(
        Uri.parse("$apiUrl?project_id=${widget.project.id}"),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          fullContext = data['long_description'] ?? widget.project.description;
          isLoading = false;
        });
      }
    } catch (e) {
      debugPrint("Error fetching details: $e");
      setState(() {
        isLoading = false;
      });
    }
  }

  // --- 1. URL LAUNCHER HELPER ---
  Future<void> _launchURL(String urlString) async {
    // Handle relative URLs (like "app-release.apk") by adding the server path
    if (!urlString.startsWith("http")) {
      urlString = "$baseUrl/$urlString";
    }

    final Uri url = Uri.parse(urlString);
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } else {
        debugPrint("Could not launch $url");
      }
    } catch (e) {
      debugPrint("Error launching URL: $e");
    }
  }

  // --- 2. PROTECTED CONTENT DIALOG ---
  void _showProtectedMessage() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF2C2C2C),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.security, color: Colors.amber),
            SizedBox(width: 10),
            Text(
              "Source Code Protected",
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
        content: const Text(
          "For security and commercial reasons, the admin has restricted access to this project's source code.\n\nHowever, you can test the full live application by clicking 'Launch Demo'.\n\nTo inquire about purchasing a license or the full script, please contact the developer.",
          style: TextStyle(height: 1.5, color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text(
              "Understood",
              style: TextStyle(color: Colors.purpleAccent),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Construct Image URL safely
    String imageUrl = widget.project.imageUrl;
    if (!imageUrl.startsWith("http")) {
      imageUrl = "$baseUrl/$imageUrl";
    }

    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        title: Text(widget.project.title),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // HERO IMAGE
            Hero(
              tag: widget.project.id,
              child: Container(
                width: double.infinity,
                height: 250,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(imageUrl),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // TITLE
                  Text(
                    widget.project.title,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // TECH STACK
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.purple.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: Colors.purpleAccent.withValues(alpha: 0.5),
                      ),
                    ),
                    child: Text(
                      widget.project.techStack,
                      style: const TextStyle(
                        color: Colors.purpleAccent,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 25),

                  // CONTEXT HEADING
                  const Text(
                    "Project Context",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // CONTEXT BODY (Loading or Text)
                  isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            color: Colors.purpleAccent,
                          ),
                        )
                      : Text(
                          fullContext ?? widget.project.description,
                          style: const TextStyle(
                            fontSize: 16,
                            height: 1.6,
                            color: Colors.white70,
                          ),
                        ),

                  const SizedBox(height: 40),

                  // --- 3. DYNAMIC ACTION BUTTONS (Matches PHP Logic) ---
                  _buildActionButtons(),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // This matches your PHP "Buttons Logic" exactly
  Widget _buildActionButtons() {
    List<Widget> buttons = [];

    // CASE 1: Thomas Code Portfolio (Special Split Logic)
    if (widget.project.title == 'Thomas Code Portfolio') {
      // 1a. Web Code (From Database)
      buttons.add(
        _buildBtn(
          label: "Web Code",
          icon: Icons.language,
          color: Colors.blueAccent,
          onTap: () => _launchURL(widget.project.githubLink ?? ""),
        ),
      );

      // 1b. App Code (Hardcoded - Matches PHP logic)
      buttons.add(
        _buildBtn(
          label: "App Code",
          icon: Icons.mobile_friendly,
          color: Colors.green,
          onTap: () => _launchURL(
            "https://github.com/Thomas-digital/ThomasCodePortfolio",
          ),
        ),
      );

      // 1c. Download
      buttons.add(
        _buildBtn(
          label: "Download App",
          icon: Icons.download,
          color: Colors.purpleAccent,
          onTap: () =>
              _launchURL("app-release.apk"), // Will resolve to full URL
        ),
      );
    } else {
      // CASE 2: Standard Projects (Matches PHP "else" block)

      // A. View Code OR Protected
      if (widget.project.githubLink != null &&
          widget.project.githubLink!.isNotEmpty) {
        buttons.add(
          _buildBtn(
            label: "View Code",
            icon: Icons.code,
            color: Colors.blueAccent,
            isOutlined: true,
            onTap: () => _launchURL(widget.project.githubLink!),
          ),
        );
      } else if (widget.project.buyLink == null ||
          widget.project.buyLink!.isEmpty) {
        // Only show protected if NOT for sale and NO code
        buttons.add(
          _buildBtn(
            label: "Protected",
            icon: Icons.lock,
            color: Colors.grey,
            isOutlined: true,
            onTap: _showProtectedMessage,
          ),
        );
      }

      // B. Download App (Checks for downloadLink in Model)
      if (widget.project.downloadLink != null &&
          widget.project.downloadLink!.isNotEmpty) {
        buttons.add(
          _buildBtn(
            label: "Download App",
            icon: Icons.download,
            color: Colors.purpleAccent,
            onTap: () => _launchURL(widget.project.downloadLink!),
          ),
        );
      }

      // C. Launch Demo
      if (widget.project.liveLink != null &&
          widget.project.liveLink!.isNotEmpty) {
        buttons.add(
          _buildBtn(
            label: "Launch Demo",
            icon: Icons.rocket_launch,
            color: Colors.orangeAccent,
            onTap: () => _launchURL(widget.project.liveLink!),
          ),
        );
      }

      // D. Buy Blueprint
      if (widget.project.buyLink != null &&
          widget.project.buyLink!.isNotEmpty) {
        buttons.add(
          _buildBtn(
            label: "Buy Blueprint",
            icon: Icons.shopping_cart,
            color: const Color(0xFF00C853), // Green for money
            onTap: () => _launchURL(widget.project.buyLink!),
          ),
        );
      }
    }

    // Return them wrapped nicely
    return Wrap(spacing: 10, runSpacing: 10, children: buttons);
  }

  // Generic Button Builder to keep code clean
  Widget _buildBtn({
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
    bool isOutlined = false,
  }) {
    // Style for Outlined Button
    if (isOutlined) {
      return OutlinedButton.icon(
        onPressed: onTap,
        icon: Icon(icon, color: color),
        label: Text(label, style: TextStyle(color: color)),
        style: OutlinedButton.styleFrom(
          side: BorderSide(color: color),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      );
    }
    // Style for Filled Button
    else {
      return ElevatedButton.icon(
        onPressed: onTap,
        icon: Icon(icon, color: Colors.white),
        label: Text(label),
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      );
    }
  }
}
