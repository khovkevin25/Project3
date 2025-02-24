<b> Food Accessibility in Philadelphia </b>

<b> Project Background:</b> The USDA (or The U.S. Department of Agriculture) in conjunction with Treasury, and HHS have defined a community as a “food desert” if that community meets specific criteria for Low Income (a poverty rate of 20 percent or greater) and Low Access (33 percent of the population lives more than 1 mile from a supermarket or large grocery store).

<b>Purpose of Project: </b>With this definition in mind, we set out to provide a better understanding of the availability and accessibility of food sources in Philadelphia by census tract, income, poverty rate, and other demographic information. Visualizations work to provide users with a more comprehensive story of how these factors combine to affect various residents within Philadelphia County. Additional interactive maps with locations of food resources like farmers markets and free meals sites also help paint a more comprehensive picture of food accessibility in Philadelphia. By understanding the accessibility landscape of Philadelphia better, shortcomings of less accessible areas within the city can be evaluated to help provide better food access to the community.

<b>Ethical Considerations:</b> Although all personally identifiable information (PII) has already been removed from the source data sets, we do acknowledge that disclosures of poverty rates and income data referencing specific geographic locations (the census tracts) can be a sensitive subject, and we strive to present the data in an unbiased and non-stigmatizing manner. Lastly, we strive to maintain contextual integrity in how we handle and present the data (cleaning and presentation) to not misrepresent or misinterpret the source data.

<b>Citations: </b>
We used three data sets - our largest data set is from the USDA which categorizes Philadelphia into census tracts and supplies the relevant data regarding food accessibility, income status, SNAP benefits status, etc.

1. Economic Research Service (ERS), U.S. Department of Agriculture (USDA). Food Access Research Atlas,  [2019 (last updated 4/27/2021)]. Available at: https://www.ers.usda.gov/data-products/food-access-research-atlas/

2-3. City of Philadelphia - https://data-phl.opendata.arcgis.com/ for both Free Meal Sites [Updated October 2024] and for the Philadelphia Farmer Markets [Updated January 2025]

<b>Code Sources:</b>
- Leaflet use guide examples were relied on for leaflet
- Class lectures 
- Markers from https://raw.githubusercontent.com/pointhi
- Python visualization library - Vega-Altair (https://altair-viz.github.io/getting_started/installation.html)
- ChatGPT for structure and error assistance 

<b>Instructions for Use:</b> Once the project is launched, there is a simple landing page that contains a brief overview of the project and the accompanying links to the individual visualizations. All visualizations have outlined Census tracts that can be clicked on to display more information regarding food accessibility and demographics about that specific region. Markers on some visualizations can also be clicked on to display more information about that specific farmers market or free meal site. These markers can be toggled on and off by pressing the associated buttons in the top right corner. Scrolling up or down (or clicking the (+) and (-) symbols in the top left corner) will allow users to zoom in and out of the map, respectively. Also, users can hold down on the mouse and drag to move the map around to explore the different outlined Census tracts in the visualization.There are several scatter plot graphs which show the relationship between median income and low-access seniors, low-access kids. The scatterplot has controls in the top right, above the graph that allow you to zoom in and zoom out. One scatter plot is not hosted in the github pages but is a python file to run in jupyter notebook.
