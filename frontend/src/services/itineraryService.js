import jsPDF from 'jspdf';

export const generatePDF = (itinerary, userInput) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text('Travel Itinerary', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Destination: ${userInput.destination}`, 20, 40);
  doc.text(`Duration: ${userInput.days} days`, 20, 50);
  doc.text(`Budget: ${userInput.budget}`, 20, 60);
  doc.text(`Travelers: ${userInput.people}`, 20, 70);
  
  let yPosition = 90;
  itinerary.forEach((place, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text(`${index + 1}. ${place.name}`, 20, yPosition);
    
    doc.setFontSize(12);
    doc.text(`Rating: ${place.rating} ⭐`, 20, yPosition + 10);
    doc.text(`Status: ${place.isOpen ? 'Open' : 'Closed'}`, 20, yPosition + 20);
    doc.text(`Type: ${place.type}`, 20, yPosition + 30);
    doc.text(`Budget: ${place.budget}`, 20, yPosition + 40);
    
    yPosition += 60;
  });
  
  doc.save('travel-itinerary.pdf');
}; 
