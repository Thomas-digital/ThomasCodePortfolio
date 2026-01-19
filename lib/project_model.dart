class Project {
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final String techStack;
  final String? githubLink;

  Project({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.techStack,
    this.githubLink,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      // This is a placeholder for now. Real images need full URLs.
      imageUrl: json['image_url'], 
      techStack: json['tech_stack'],
      githubLink: json['github_link'],
    );
  }
}