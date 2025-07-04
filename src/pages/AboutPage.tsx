import { Image } from "primereact/image";
import { ContentBox } from "../styles/section";
import about from "../assets/about.png"

export function AboutPage() {
    return (
        <>
            <ContentBox>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '2rem',
                        flexWrap: 'wrap'
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontFamily: 'var(--font-family)',
                                color:"#fb908b", 
                                margin: 20
                            }}
                        >
                            SOBRE O SISTEMA
                        </h1>

                        <p style={{
                            flex: 1,
                            fontSize: '1.1rem',
                            maxWidth: "500px",
                            lineHeight: '1.6',
                            margin: 20,
                            fontFamily: 'var(--font-family)',
                        }}>
                            Este sistema foi criado para auxiliar no agendamento e organização de serviços.
                            Ele permite gerenciar horários, profissionais, clientes e atendimentos de forma simples
                            e eficiente.
                        </p>
                    </div>
                    
                    <Image
                        src={about}
                        alt="Sobre o sistema"
                        width="300"
                        style={{ borderRadius: '12px', flexShrink: 0, margin: 20, }}
                    />
                </div>
            </ContentBox>
        </>
    )
}