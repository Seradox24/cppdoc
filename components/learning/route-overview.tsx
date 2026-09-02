import Link from 'next/link';
import { ArrowRight, Box, Braces, Compass } from 'lucide-react';
import { cppActivities, learningGroups } from '@/lib/lessons';

export function RouteOverview() {
  return (
    <section id="ruta" className="content-section route-section">
      <div className="section-heading">
        <div>
          <div className="eyebrow section-eyebrow">EL CAMINO, PASO A PASO</div>
          <h2>Tu ruta de aprendizaje</h2>
          <p>
            Una bienvenida y dos grupos. Primero C++ sin el motor; después,
            Unreal Engine.
          </p>
        </div>
        <span className="muted route-count">2 grupos de aprendizaje</span>
      </div>
      <div className="route-cards">
        <Link href="/" className="route-card current">
          <div className="route-card-top">
            <span className="route-icon">
              <Compass size={20} />
            </span>
            <span className="small-pill">Estás aquí</span>
          </div>
          <span className="route-number">TU PUNTO DE PARTIDA</span>
          <h3>Bienvenida</h3>
          <p>Conoce la guía y experimenta con una primera idea visual.</p>
          <div className="route-card-bottom">
            <span>Independiente del temario</span>
            <ArrowRight size={17} />
          </div>
        </Link>
        {learningGroups.map((group, index) => (
          <Link key={group.id} href={group.href} className="route-card">
            <div className="route-card-top">
              <span className={`route-icon ${index === 0 ? 'blue' : ''}`}>
                {index === 0 ? <Braces size={20} /> : <Box size={20} />}
              </span>
              <span className="small-pill neutral">
                {index === 0 ? 'Temario preparado' : 'Por definir'}
              </span>
            </div>
            <span className="route-number">GRUPO 0{index + 1}</span>
            <h3>{group.title}</h3>
            <p>
              {index === 0
                ? 'Las bases del lenguaje, organizadas en actividades que iremos desarrollando.'
                : 'Un espacio reservado para aplicar C++ al motor cuando lleguemos a esa etapa.'}
            </p>
            <div className="route-card-bottom">
              <span>
                {index === 0
                  ? `${cppActivities.length} actividades pendientes`
                  : 'Actividades por definir'}
              </span>
              <ArrowRight size={17} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
