// --- FUNCIÓN DE AYUDA PARA GENERAR DATOS 3D ---
/**
 * Genera datos para un modelo de regresión múltiple 3D.
 * @param {boolean} isHomoscedastic - True para varianza constante.
 * @param {number} pointsPerAxis - Puntos por cada eje (ej. 20 -> 20x20 = 400 puntos).
 */
function generateRegressionData3D(isHomoscedastic, pointsPerAxis = 20) {
  // Datos para el SCATTER PLOT (puntos observados)
  let x1_flat = [];
  let x2_flat = [];
  let y_observed_flat = [];

  // Datos para el SURFACE PLOT (plano verdadero)
  let x1_grid = []; // Eje X del plano
  let x2_grid = []; // Eje Y del plano
  let y_true_plane = []; // Matriz de alturas (eje Z) del plano

  // Parámetros del modelo "verdadero"
  const beta_0 = 50;
  const beta_1 = 2.5;
  const beta_2 = -1.5;

  const range = 50;

  for (let j = 0; j < pointsPerAxis; j++) {
    const x2_j = (j / (pointsPerAxis - 1)) * range;
    x2_grid.push(x2_j);
    
    let y_true_row = []; // Fila para la matriz del plano

    for (let i = 0; i < pointsPerAxis; i++) {
      const x1_i = (i / (pointsPerAxis - 1)) * range;
      if (j === 0) {
        x1_grid.push(x1_i); // Solo llenar una vez
      }

      // 1. Calcular el valor verdadero (en el plano)
      const true_y_ij = beta_0 + beta_1 * x1_i + beta_2 * x2_j;
      y_true_row.push(true_y_ij);

      // 2. Calcular el error (u)
      let error_std_dev;
      if (isHomoscedastic) {
        // Varianza constante en todo el plano
        error_std_dev = 15;
      } else {
        // Varianza depende de X1 (crece con X1)
        error_std_dev = 2 + 0.8 * x1_i;
      }
      
      // Error con media cero
      const error_ij = (Math.random() - 0.5) * 2 * error_std_dev;

      // 3. Calcular el valor observado (Y)
      const observed_y_ij = true_y_ij + error_ij;

      // Guardar para el scatter plot
      x1_flat.push(x1_i);
      x2_flat.push(x2_j);
      y_observed_flat.push(observed_y_ij);
    }
    
    y_true_plane.push(y_true_row);
  }

  return { 
    scatter: { x: x1_flat, y: x2_flat, z: y_observed_flat },
    surface: { x: x1_grid, y: x2_grid, z: y_true_plane }
  };
}


// --- GRÁFICO 1: HOMOCEDASTICIDAD (3D) ---

const dataHomo3D = generateRegressionData3D(true);

// Trazado de los puntos observados
const traceHomo_Data = {
  ...dataHomo3D.scatter,
  mode: 'markers',
  type: 'scatter3d',
  name: 'Datos Observados (y)',
  marker: { color: 'blue', opacity: 0.6, size: 3 }
};

// Trazado del plano de regresión verdadero
const traceHomo_Plane = {
  ...dataHomo3D.surface,
  type: 'surface',
  name: 'Plano Verdadero E[y|X]',
  colorscale: 'Reds',
  opacity: 0.7,
  showscale: false // Oculta la barra de escala de color
};

const layoutHomo3D = {
  title: 'Gráfico 1: Homocedasticidad (Varianza Constante)',
  scene: {
    xaxis: { title: 'X1' },
    yaxis: { title: 'X2' },
    zaxis: { title: 'Y' },
    // Anotación en 3D
    annotations: [{
      showarrow: false,
      x: 10, y: 40, z: 100, // Coordenadas de la etiqueta
      text: '<b>Media Cero y Varianza Constante</b><br>Grosor de nube uniforme.',
      font: { color: 'black', size: 12 },
      bgcolor: 'rgba(255,255,255,0.7)'
    }]
  },
  margin: { l: 0, r: 0, b: 0, t: 40 }
};

Plotly.newPlot('chartHomo3D', [traceHomo_Data, traceHomo_Plane], layoutHomo3D);


// --- GRÁFICO 2: HETEROCEDASTICIDAD (3D) ---

const dataHetero3D = generateRegressionData3D(false);

// Trazado de los puntos observados
const traceHetero_Data = {
  ...dataHetero3D.scatter,
  mode: 'markers',
  type: 'scatter3d',
  name: 'Datos Observados (y)',
  marker: { color: 'green', opacity: 0.6, size: 3 }
};

// Trazado del plano de regresión verdadero
const traceHetero_Plane = {
  ...dataHetero3D.surface,
  type: 'surface',
  name: 'Plano Verdadero E[y|X]',
  colorscale: 'Reds',
  opacity: 0.7,
  showscale: false
};

const layoutHetero3D = {
  title: 'Gráfico 2: Heterocedasticidad (Varianza No Constante)',
  scene: {
    xaxis: { title: 'X1' },
    yaxis: { title: 'X2' },
    zaxis: { title: 'Y' },
    // Anotación en 3D
    annotations: [{
      showarrow: false,
      x: 40, y: 20, z: 200, // Coordenadas de la etiqueta
      text: '<b>¡Heterocedasticidad!</b><br>La dispersión (varianza)<br>aumenta con X1.',
      font: { color: 'black', size: 12 },
      bgcolor: 'rgba(255,255,255,0.7)'
    }]
  },
  margin: { l: 0, r: 0, b: 0, t: 40 }
};

Plotly.newPlot('chartHetero3D', [traceHetero_Data, traceHetero_Plane], layoutHetero3D);