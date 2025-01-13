# Photo Based Issue Reporting
<p>Photo Based Issue Reporting is a project consisting of a mobile and web application designed to facilitate the reporting and management of city issues by citizens and administrators. The application enables users to easily report problems in their community using photos, while administrators can manage these reports efficiently through a dedicated web interface. The key features include: </p>

<ul>
    <li><strong>Issue Reporting:</strong> Users can report city issues by uploading photos and providing descriptions. The reports can include details such as the image, location, and additional notes to help city administrators take appropriate action.</li>
    <li><strong>Photo Upload and Storage:</strong> Photos of reported issues are securely uploaded and stored using Cloudinary, ensuring efficient and reliable media management.</li>
    <li><strong>AI-Powered Categorization:</strong> The system is designed to use AI for automatic categorization of reported issues based on the uploaded photos and descriptions. Feature realized using Gemini Api.</li>
    <li><strong>User Authentication:</strong> The application requires user authentication using JWT (JSON Web Tokens) for secure access and management of reports.</li>
    <li><strong>Administrator Management:</strong> City administrators have access to a web application where they can view, manage, and respond to reported issues. The web app provides a comprehensive dashboard for efficient issue tracking and resolution.</li>
    <li><strong>Reverse Geocoding:</strong> The mobile application includes reverse geocoding to automatically determine and attach the location of the reported issue based on the user's position.</li>
    <li><strong>Interactive Map:</strong> The web application integrates Leaflet to display reported issues on an interactive map, helping administrators visualize the locations and statuses of various reports.</li>
</ul>

# Architecture Diagram
<img src="Images/Architektura.svg" style="max-width: 100%; height:auto">

# Database Model
<img src="Images/BD.svg" style="max-width: 100%; height:auto">

# Technologies
<ul>
    <li>.NET Core</li>
    <li>Entity Framework Core</li>
    <li>Microsoft SQL Server (MSSQL)</li>
    <li>Identity Library</li>
    <li>JWT (JSON Web Tokens)</li>
    <li>React Native</li>
    <li>Cloudinary</li>
    <li>Reverse Geocoding</li>
    <li>React (JavaScript)</li>
    <li>Leaflet</li>
    <li>Gemini API</li>
</ul>

# Screenshots

### Mobile App Login/Register Form

<table>
  <tr>
    <td><img src="Images/Screenshot_1717618799.png" style="max-width: 50%; height: auto;"></td>
    <td><img src="Images/Screenshot_1717618868.png" style="max-width: 50%; height: auto;"></td>
  </tr>
</table>

### List of defects and defect details

<table>
  <tr>
    <td><img src="Images/Screenshot_1717620900.png" style="max-width: 50%; height: auto;"></td>
    <td><img src="Images/Screenshot_1717620905.png" style="max-width: 50%; height: auto;"></td>
  </tr>
</table>

### Add Defect Form and Location Request

<table>
  <tr>
    <td><img src="Images/Screenshot_1717621034.png" style="max-width: 50%; height: auto;"></td>
    <td><img src="Images/Screenshot_1717620956.png" style="max-width: 50%; height: auto;"></td>
  </tr>
</table>

### Web App Main Page
<img src="Images/WebMainPage.png" style="max-width: 100%; height:auto">

### Web App Defect List
<img src="Images/ListOfDefects.png" style="max-width: 100%; height:auto">

# Add Defect Sequence Diagram
## Backend
<img src="Images/AddDefect_backend.svg" style="max-width: 100%; height:auto">

## Frontend
<img src="Images/Zgłaszanie_usterki_mobile_app.svg" style="max-width: 100%; height:auto">
