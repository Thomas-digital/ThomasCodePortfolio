import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../models/project_model.dart'; 
import 'project_detail_screen.dart';

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  List<Project> projects = [];
  bool isLoading = true;

  // ⚠️ USE 10.0.2.2 FOR EMULATOR
  final String apiUrl = "http://10.0.2.2/my_portfolio/api.php";

  @override
  void initState() {
    super.initState();
    fetchProjects();
  }

  Future<void> fetchProjects() async {
    try {
      final response = await http.get(Uri.parse(apiUrl));
      if (response.statusCode == 200) {
        if (response.body.isEmpty) return;
        List<dynamic> data = json.decode(response.body);
        setState(() {
          projects = data.map((json) => Project.fromJson(json)).toList();
          isLoading = false;
        });
      }
    } catch (e) {
      debugPrint("Error loading projects: $e");
      setState(() => isLoading = false);
    }
  }

  Future<void> _refresh() async {
    await fetchProjects();
  }

  Future<void> _handleLink(String? urlString) async {
    if (urlString != null && await canLaunchUrl(Uri.parse(urlString))) {
      await launchUrl(
        Uri.parse(urlString),
        mode: LaunchMode.externalApplication,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Colors.purpleAccent),
      );
    }

    return RefreshIndicator(
      onRefresh: _refresh,
      color: Colors.purpleAccent,
      backgroundColor: const Color(0xFF1E1E1E),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: projects.length,
        itemBuilder: (context, index) {
          final project = projects[index];

          final bool isForSale =
              project.buyLink != null && project.buyLink!.isNotEmpty;
          final bool isProtected = project.githubLink == null;

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            color: const Color(0xFF1E1E1E),
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Thumbnail
                      Hero(
                        tag: project.id,
                        child: Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            image: DecorationImage(
                              image: NetworkImage(
                                "http://10.0.2.2/my_portfolio/${project.imageUrl}",
                              ),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      // Title & Tech Stack
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              project.title,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              project.techStack,
                              style: const TextStyle(
                                color: Colors.purpleAccent,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Description
                  Text(
                    project.description,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14,
                      height: 1.5,
                      color: Colors.white70,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // --- ACTION BUTTONS ROW ---
                  Row(
                    children: [
                      // BUTTON 1: BUY vs VIEW CODE
                      if (isForSale)
                        ElevatedButton.icon(
                          onPressed: () => _handleLink(project.buyLink),
                          icon: const Icon(
                            Icons.shopping_cart,
                            size: 16,
                            color: Colors.black,
                          ),
                          label: const Text(
                            "Buy Blueprint",
                            style: TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF00E676),
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                          ),
                        )
                      else
                        TextButton.icon(
                          onPressed: isProtected
                              ? null
                              : () => _handleLink(project.githubLink),
                          icon: Icon(
                            isProtected ? Icons.lock : Icons.code,
                            size: 18,
                            color: isProtected
                                ? Colors.grey
                                : Colors.blueAccent,
                          ),
                          label: Text(
                            isProtected ? "Protected" : "View Code",
                            style: TextStyle(
                              color: isProtected
                                  ? Colors.grey
                                  : Colors.blueAccent,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),

                      const Spacer(),

                      // BUTTON 2: DETAILS
                      ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  ProjectDetailScreen(project: project),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2C2C2C),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                        child: const Row(
                          children: [
                            Text("Details"),
                            SizedBox(width: 6),
                            Icon(Icons.arrow_forward, size: 16),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}