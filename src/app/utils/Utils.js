
export const generateRandomName = () => {
  const firstNames = [
    "John", "Jane", "Alex", "Emily", "Michael", "Sarah",
    "David", "Laura", "Chris", "Emma", "James", "Sophia",
    "Daniel", "Olivia", "Matthew", "Isabella", "Andrew", "Mia",
  ];

  const lastNames = [
    "Smith", "Johnson", "Brown", "Williams", "Jones", "Garcia",
    "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez",
    "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore",
  ];

  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${randomFirstName} ${randomLastName}`;
};


export const generateUserId = () => {
  return Array.from({ length: 4 }, () =>
    Math.random().toString(36).charAt(2)
  ).join("");
};


export const generateColor = (name) => {
  const colors = [
    'bg-blue-600',
    'bg-purple-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-pink-600',
    'bg-indigo-600',
    'bg-red-600',
    'bg-teal-600'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}


export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
