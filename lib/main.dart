import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'project_model.dart';
import 'package:url_launcher/url_launcher.dart';

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
        brightness: Brightness.dark, // Dark mode for that "Developer" vibe
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const PortfolioHomeScreen(),
    );
  }
}

class PortfolioHomeScreen extends StatefulWidget {
  const PortfolioHomeScreen({super.key});

  @override
  State<PortfolioHomeScreen> createState() => _PortfolioHomeScreenState();
}

class _PortfolioHomeScreenState extends State<PortfolioHomeScreen> {
  List<Project> projects = [];
  bool isLoading = true;

  // ⚠️ SPECIAL IP ADDRESS FOR ANDROID EMULATOR
  // If using a physical phone, change this to your PC's Wi-Fi IP (e.g., http://192.168.1.5/...)
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
        List<dynamic> data = json.decode(response.body);
        setState(() {
          projects = data.map((json) => Project.fromJson(json)).toList();
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load projects');
      }
    } catch (e) {
      print("Error: $e");
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Thomas Code Projects"),
        centerTitle: true,
        elevation: 0,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : projects.isEmpty
          ? const Center(child: Text("No projects found (Check Database)"))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: projects.length,
              itemBuilder: (context, index) {
                final project = projects[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Project Title & Stack
                      ListTile(
                        title: Text(
                          project.title,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                          ),
                        ),
                        subtitle: Text(
                          project.techStack,
                          style: TextStyle(color: Colors.blueAccent[100]),
                        ),
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(
                            8,
                          ), // Rounds the corners nicely
                          child: Image.network(
                            // We stick the base URL + the image path together
                            "http://10.0.2.2/my_portfolio/${project.imageUrl}",
                            width: 60,
                            height: 60,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              // If the image fails to load, show the icon as a backup
                              return const Icon(Icons.code, size: 40);
                            },
                          ),
                        ),
                      ),

                      // Description
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        child: Text(
                          project.description,
                          style: const TextStyle(fontSize: 15, height: 1.4),
                        ),
                      ),

                      // Buttons
                      OverflowBar(
                        alignment: MainAxisAlignment.start,
                        children: [
                          if (project.githubLink != null)
                            TextButton.icon(
                              icon: const Icon(Icons.link),
                              label: const Text("View Code"),
                              onPressed: () async {
                                final Uri url = Uri.parse(project.githubLink!);

                                if (await canLaunchUrl(url)) {
                                  await launchUrl(
                                    url,
                                    mode: LaunchMode.externalApplication,
                                  );
                                } else {
                                  // If it fails, print the error to console
                                  print("Could not launch $url");
                                }
                              },
                            ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
