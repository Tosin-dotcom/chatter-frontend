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
  
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  
    return `${randomFirstName} ${randomLastName}`;
  };
  