#!/usr/bin/env python3
"""
Script to create placeholder profile pictures for staff members.
Creates simple colored squares that can be easily replaced with actual photos later.
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Create uploads/staff directory if it doesn't exist
staff_dir = "backend/uploads/staff"
os.makedirs(staff_dir, exist_ok=True)

# Staff members and their placeholder colors
staff_data = [
    ("president-maria-osmena.jpg", "Dr. Maria Carmen Osmeña\nPresident", (52, 73, 94)),  # Dark blue-gray
    ("vp-roberto-santos.jpg", "Dr. Roberto Santos\nVP Academic Affairs", (41, 128, 185)),  # Blue
    ("dean-elena-rodriguez.jpg", "Prof. Elena Rodriguez\nDean of Computer Science", (142, 68, 173)),  # Purple
    ("dean-miguel-fernandez.jpg", "Dr. Miguel Fernandez\nDean of Business Admin", (39, 174, 96)),  # Green
    ("registrar-catherine-lim.jpg", "Ms. Catherine Lim\nRegistrar", (230, 126, 34)),  # Orange
    ("director-james-garcia.jpg", "Mr. James Garcia\nDirector Student Affairs", (231, 76, 60)),  # Red
    ("librarian-ana-reyes.jpg", "Ms. Ana Reyes\nHead Librarian", (155, 89, 182)),  # Light purple
    ("manager-david-cruz.jpg", "Engr. David Cruz\nFacilities Manager", (46, 204, 113))  # Light green
]

def create_placeholder_image(filename, text, color):
    """Create a placeholder profile picture with colored background and text."""
    
    # Create a 200x200 image with colored background
    img = Image.new('RGB', (200, 200), color)
    draw = ImageDraw.Draw(img)
    
    try:
        # Try to use a system font
        font = ImageFont.truetype("arial.ttf", 14)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Add white text in the center
    lines = text.split('\n')
    total_height = len(lines) * 20
    y_start = (200 - total_height) // 2
    
    for i, line in enumerate(lines):
        # Get text size for centering
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (200 - text_width) // 2
        y = y_start + i * 20
        
        # Draw text with white color
        draw.text((x, y), line, fill=(255, 255, 255), font=font)
    
    # Save the image
    filepath = os.path.join(staff_dir, filename)
    img.save(filepath, 'JPEG', quality=95)
    print(f"Created: {filepath}")

# Create placeholder images for all staff members
print("Creating placeholder profile pictures...")
for filename, text, color in staff_data:
    create_placeholder_image(filename, text, color)

print(f"\nSuccessfully created {len(staff_data)} placeholder profile pictures!")
print(f"Images saved in: {staff_dir}")
print("\nNote: These are placeholder images. Replace them with actual professional photos when available.")
