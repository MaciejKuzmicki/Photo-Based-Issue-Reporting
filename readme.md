# Photo Based Issue Reporting
<p>Photo Based Issue Reporting is a project consisting of a mobile and web application designed to facilitate the reporting and management of city issues by citizens and administrators. The application enables users to easily report problems in their community using photos, while administrators can manage these reports efficiently through a dedicated web interface. The key features include: </p>

<ul>
    <li><strong>Issue Reporting:</strong> Users can report city issues by uploading photos and providing descriptions. The reports can include details such as the image, location, and additional notes to help city administrators take appropriate action.</li>
    <li><strong>Photo Upload and Storage:</strong> Photos of reported issues are securely uploaded and stored using Cloudinary, ensuring efficient and reliable media management.</li>
    <li><strong>AI-Powered Categorization:</strong> The system is designed to use AI for automatic categorization of reported issues based on the uploaded photos. However, due to the lack of a sufficient training dataset, this feature is currently non-functional.</li>
    <li><strong>User Authentication:</strong> The application requires user authentication using JWT (JSON Web Tokens) for secure access and management of reports.</li>
    <li><strong>Administrator Management:</strong> City administrators have access to a web application where they can view, manage, and respond to reported issues. The web app provides a comprehensive dashboard for efficient issue tracking and resolution.</li>
    <li><strong>Reverse Geocoding:</strong> The mobile application includes reverse geocoding to automatically determine and attach the location of the reported issue based on the user's position.</li>
    <li><strong>Interactive Map:</strong> The web application integrates Leaflet to display reported issues on an interactive map, helping administrators visualize the locations and statuses of various reports.</li>
</ul>

# Technologies
<ul>
    <li><strong>.NET Core:</strong> A cross-platform, high-performance framework used for building the backend API, ensuring robust and scalable server-side functionality.</li>
    <li><strong>Entity Framework Core:</strong> An Object-Relational Mapper (ORM) for .NET, providing a streamlined data access layer for interacting with the database.</li>
    <li><strong>Microsoft SQL Server (MSSQL):</strong> A powerful, enterprise-grade relational database management system used for storing and managing application data.</li>
    <li><strong>Identity Library:</strong> Used for managing user authentication and authorization, providing secure access control within the application.</li>
    <li><strong>JWT (JSON Web Tokens):</strong> Used for secure user authentication, enabling token-based authentication for API endpoints.</li>
    <li><strong>React Native:</strong> A popular framework for building the mobile application, allowing for cross-platform development with a single codebase using TypeScript.</li>
    <li><strong>Cloudinary:</strong> A cloud-based service for managing media assets, used for secure and efficient storage and delivery of photos uploaded by users.</li>
    <li><strong>Reverse Geocoding:</strong> A technology used in the mobile app to convert geographic coordinates into human-readable addresses, aiding in the precise location reporting of issues.</li>
    <li><strong>React (JavaScript):</strong> A widely-used JavaScript library for building dynamic and responsive user interfaces, employed in the development of the web application.</li>
    <li><strong>Leaflet:</strong> An open-source JavaScript library used for interactive maps, allowing administrators to visualize reported issues on a geographic map.</li>
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

### Web App Main Page With Fixed Defect Details
<img src="Images/WebMainPageWithMarker.png" style="max-width: 100%; height:auto">

### Web App Defect List
<img src="Images/ListOfDefects.png" style="max-width: 100%; height:auto">

