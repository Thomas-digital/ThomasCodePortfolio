import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212), // Dark Background
      appBar: AppBar(
        title: const Text("Profile"),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        // This automatically handles your logic:
        // If from Game -> Shows Back Arrow (Goes back to Game)
        // If from Tab -> No Back Arrow (Stays on Tab)
        automaticallyImplyLeading: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // --- 1. PROFILE HEADER ---
            Center(
              child: Column(
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.purpleAccent, width: 3),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.purpleAccent.withValues(alpha: 0.3),
                          blurRadius: 20,
                          spreadRadius: 2,
                        ),
                      ],
                      image: const DecorationImage(
                        // Ensure 'assets/profile.png' is in pubspec.yaml
                        image: AssetImage('assets/profile.png'),
                        fit: BoxFit.cover,
                      ),
                    ),
                    // Fallback icon if image fails to load
                    child: const CircleAvatar(
                      backgroundColor: Colors.transparent,
                    ),
                  ),
                  const SizedBox(height: 15),
                  const Text(
                    "Thomas Ozichukwu",
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 5),
                  const Text(
                    "Admin & Lead Developer",
                    style: TextStyle(fontSize: 16, color: Colors.purpleAccent),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 25),

            // --- 2. SKILL TAGS ---
            Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              children: [
                _buildSkillTag("Flutter & Dart"),
                _buildSkillTag("PHP & MySQL"),
                _buildSkillTag("UI/UX Design"),
                _buildSkillTag("AI-Augmented Dev"),
              ],
            ),

            const SizedBox(height: 25),

            // --- 3. BIO SECTION ---
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E1E),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '"I build complete products, not just code."',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 15),

                  RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 15,
                        height: 1.6,
                      ),
                      children: [
                        TextSpan(text: "I am a Full-Stack Engineer and "),
                        TextSpan(
                          text: "Product Designer",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextSpan(
                          text:
                              ". Unlike standard developers, I personally design every interface I build (like ",
                        ),
                        TextSpan(
                          text: "Dxflix",
                          style: TextStyle(
                            fontStyle: FontStyle.italic,
                            color: Colors.white,
                          ),
                        ),
                        TextSpan(text: " and "),
                        TextSpan(
                          text: "Hive",
                          style: TextStyle(
                            fontStyle: FontStyle.italic,
                            color: Colors.white,
                          ),
                        ),
                        TextSpan(
                          text:
                              "), ensuring your app looks beautiful from Day 1.",
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 15),

                  const Text(
                    "Hire me to:",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 5),
                  _buildBulletPoint("Design & Build your MVP in < 90 days."),
                  _buildBulletPoint(
                    "Fix broken apps other developers gave up on.",
                  ),
                  _buildBulletPoint(
                    "Deploy high-performance architectures (60fps).",
                  ),
                ],
              ),
            ),

            const SizedBox(height: 25),

            // --- 4. CONTACT BUTTONS ---
            const Text(
              "Connect With Me",
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 15),

            Row(
              children: [
                Expanded(
                  child: _buildContactButton(
                    label: "WhatsApp",
                    icon: Icons.chat_bubble,
                    color: const Color(0xFF25D366),
                    url: "https://wa.me/2349131564197",
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildContactButton(
                    label: "LinkedIn",
                    icon: Icons.business_center,
                    color: const Color(0xFF0077b5),
                    url:
                        "https://www.linkedin.com/in/thomas-ozichukwu-40441b304",
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: _buildContactButton(
                    label: "GitHub",
                    icon: Icons.code,
                    color: const Color(0xFF333333),
                    url:
                        "https://github.com/Thomas-digital/ThomasCodePortfolio",
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildContactButton(
                    label: "Email",
                    icon: Icons.email,
                    color: const Color(0xFFEA4335),
                    url: "mailto:thomaso.digital@gmail.com",
                  ),
                ),
              ],
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  // --- HELPER WIDGETS ---

  Widget _buildSkillTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.purpleAccent.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.purpleAccent.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.purpleAccent,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "• ",
            style: TextStyle(color: Colors.purpleAccent, fontSize: 16),
          ),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(color: Colors.grey, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactButton({
    required String label,
    required IconData icon,
    required Color color,
    required String url,
  }) {
    return ElevatedButton.icon(
      onPressed: () async {
        final Uri uri = Uri.parse(url);
        try {
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          }
        } catch (e) {
          debugPrint("Error launching $url: $e");
        }
      },
      icon: Icon(icon, color: Colors.white, size: 20),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 15),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}
