import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Header from '../components/Header';
import CustomerPage from './CustomerPage';
import ProfessionalPage from './ProfessionalPage';
import ServicePage from './ServicePage';
import SlotPage from './SlotPage'
import { Section } from '../styles/section';
import { AboutPage } from './AboutPage';

export default function HomePage() {

    return (
        <>
            <Header />

            <Section id="about" $bg="#9ccbf2">
                <AboutPage />
            </Section>

            <Section id="slot" $bg="#9ccbf2">
                <SlotPage />
            </Section>

            <Section id="customer" $bg="#9ccbf2">
                <CustomerPage />
            </Section>

            <Section id="service" $bg="#9ccbf2">
                <ServicePage />
            </Section>

            <Section id="professional" $bg="#9ccbf2">
                <ProfessionalPage />
            </Section>

        </>
    )
}