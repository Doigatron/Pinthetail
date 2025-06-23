import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  useEffect(() => {
    const map = L.map('map').setView([43.65, -79.38], 12); // Toronto area

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const getIcon = (type) => {
      const colors = {
        cat: 'orange',
        dog: 'blue',
        other: 'green',
      };

      return L.divIcon({
        className: 'custom-icon',
        html: `<div style="
          background-color: ${colors[type] || 'gray'};
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
    };

    map.on('click', (e) => {
      const coords = e.latlng;

      const formHtml = `
        <form id="pinForm">
          <label>Type:
            <select name="type">
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
              <option value="other">Other</option>
            </select>
          </label><br/>
          <label>Color: <input type="text" name="color" /></label><br/>
          <label>Description: <textarea name="description"></textarea></label><br/>
          <label>Photo: <input type="file" name="photo" accept="image/*" /></label><br/>
          <button type="submit">Add Pin</button>
        </form>
      `;

      const popup = L.popup()
        .setLatLng(coords)
        .setContent(formHtml)
        .openOn(map);

      setTimeout(() => {
        const form = document.getElementById('pinForm');
        if (form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const type = formData.get('type');
            const color = formData.get('color');
            const description = formData.get('description');
            const photoFile = formData.get('photo');
            const photoUrl = photoFile ? URL.createObjectURL(photoFile) : '';

            L.marker(coords, { icon: getIcon(type) })
              .addTo(map)
              .bindPopup(`
                <b>${type}</b><br/>
                ${color ? `Color: ${color}<br/>` : ''}
                ${description ? `Description: ${description}<br/>` : ''}
                ${photoUrl ? `<img src="${photoUrl}" alt="pet photo" width="150"/>` : ''}
              `)
              .openPopup();

            map.closePopup();
          });
        }
      }, 100);
    });
  }, []);

  return (
    <div id="map" style={{ height: '80vh', width: '100%' }}></div>
  );
};

export default Map;
