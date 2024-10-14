# Remove.bg Clone with Magic Brush

This project is a clone of the [remove.bg](https://www.remove.bg/) UI built using HTML and CSS. It also incorporates background removal functionality through an API fetch from the remove.bg service. Additionally, a "Magic Brush" tool is implemented to erase specific areas of the image after the background has been removed, providing finer control over the background removal.

## Features

- **Background Removal**: Upload an image and remove its background using the remove.bg API.
- **Magic Brush**: After the background is removed, use the brush tool to manually erase parts of the image with precision.
- **Clean UI**: Simple and intuitive interface designed with HTML and CSS to mimic remove.bg.
- **Responsive Design**: Optimized for use on various devices.

## Demo


## Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (Fetch API)**

## How It Works

1. **Upload Image**: Users can upload an image from their local machine.
2. **Background Removal**: Once the image is uploaded, the remove.bg API is called via a `fetch` request, and the background is removed.
3. **Manual Adjustment with Magic Brush**: Users can then refine the image using a brush tool to erase or restore parts of the image.
4. **Download**: After editing, users can download the modified image.

## Installation

To run this project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/remove-bg-clone.git
