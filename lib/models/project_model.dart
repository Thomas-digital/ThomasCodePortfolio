class Project {
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final String techStack;
  final String? githubLink;
  final String? liveLink;
  final String? buyLink;
  final String? downloadLink;

  Project({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.techStack,
    this.githubLink,
    this.liveLink,
    this.buyLink,
    this.downloadLink,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      // 1. Force ID to String (Fixes Integer crash if DB sends number)
      id: json['id'].toString(),

      // 2. CRASH PROOFING: If DB returns null, use a default string
      title: json['title'] ?? "Untitled Project",
      description: json['description'] ?? "No description available.",
      imageUrl: json['image_url'] ?? "", // Prevents crash if image is missing
      techStack: json['tech_stack'] ?? "Tech stack not specified",

      // 3. Nullable fields (These are safe to be null)
      githubLink: json['github_link'],
      liveLink: json['live_link'],
      buyLink: json['buy_link'],
      downloadLink: json['download_link'],
    );
  }
}
