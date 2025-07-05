import { useState, useEffect, useRef, useCallback } from 'react';
import { SlotDTO, CreateSlotDTO, SlotStatusMap } from '../dtos/SlotDTO';
import {
    getAllSlots,
    getSlotById, cancelSlot, createSlot,
    getAvailableSlots,
    scheduleSlot
} from '../services/SlotService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask'
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast'
import { ContentBox } from '../styles/section';
import { Dialog } from 'primereact/dialog';
import { getAllServices } from '../services/ServiceService';
import { getAllProfessionals } from '../services/ProfessionalService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { getAllCustomers, getCustomer } from '../services/CustomerService';

export default function SlotPage() {
    const [services, setServices] = useState<{ id: number, name: string }[]>([]);
    const [selectedService, setSelectedService] = useState<{ id: number, name: string } | null>(null);
    const [professionals, setProfessionals] = useState<{ id: number, name: string }[]>([]);
    const [selectedProfessional, setSelectedProfessional] = useState<{ id: number, name: string } | null>(null);
    const [customer, setCustomer] = useState<{ id: number, name: string }[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<{ id: number, name: string } | null>(null);

    const [loading, setLoading] = useState(false);

    const [availableSlots, setAvailableSlots] = useState<SlotDTO[]>([]);
    const [slots, setSlots] = useState<SlotDTO[]>([]);
    const [buscaId, setBuscaId] = useState('');
    const [slotEncontrado, setSlotEncontrado] = useState<SlotDTO[] | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const [formData, setFormData] = useState<CreateSlotDTO>({
        customerId: 0,
        professionalId: 0,
        serviceId: 0,
        date: '',
        dateSlotFormatted: '',
        description: '',
        status: undefined
    });

    useEffect(() => {
        (async () => {
            try {
                const [slotsData, servicesData, professionalsData, customers] = await Promise.all([
                    getAllSlots(),
                    getAllServices(),
                    getAllProfessionals(),
                    getAllCustomers()
                ]);

                setSlots(slotsData);
                setServices(servicesData.map(s => ({ id: s.id!, name: s.name })));
                setProfessionals(professionalsData.map(p => ({ id: p.id!, name: p.name })));
                setCustomer(customers.map(c => ({ id: c.id!, name: c.name })));
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar dados iniciais.', life: 3000 });
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!selectedService || !selectedProfessional) {
                setSlots([]);
                return;
            }

            try {
                const slotsData = await getAvailableSlots(selectedService.id, selectedProfessional.id);
                setAvailableSlots(slotsData);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar slots.', life: 3000 });
            }

        })();
    }, [selectedService, selectedProfessional])

    const buscarPorId = async () => {
        if (buscaId === null || buscaId === '') return;
        try {
            const data = await getSlotById(Number(buscaId));
            setSlotEncontrado([data]);
        } catch {
            setSlotEncontrado(null);
            toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Slot n�o encontrado', life: 3000 });
        }
    };

    const criarSlot = async () => {
        if (formData) {
            try {
                delete formData.dateSlotFormatted;
                delete formData.status
                const criado = await createSlot(formData);
                setSlots((prev) => [...prev, criado]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Serviço adicionado',
                    life: 3000
                });
                setFormVisible(false)
            } catch {
                setSlots([])
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível agendar um serviço',
                    life: 3000
                });
                setFormVisible(false)
            }
        }
    }

    const cancelarSlot = async (id: number) => {
        try {
            const result = await cancelSlot(id);
            console.log(result)
            toast.current?.show({
                severity: 'warn',
                summary: 'Removido',
                detail: `Agendamento ID ${id} foi cancelado`,
                life: 3000
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao cancelar agendamento',
                life: 3000
            });
        }
    }

    const handleBookSlotClick = useCallback((slotId: number) => {
        if (!selectedCustomer)
            return toast.current?.show({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Selecione um cliente antes de agendar um horário.',
                life: 3000
            });

        try {
            scheduleSlot(slotId, selectedCustomer.id);
        }
        catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao agendar horário.',
                life: 3000
            });
        }
    }, [selectedCustomer]);

    const abrirEditor = (Slot?: CreateSlotDTO) => {
        setFormData(Slot ?? {
            customerId: 0,
            professionalId: 0,
            serviceId: 0,
            date: '',
            description: '',
            dateSlotFormatted: '',
            status: undefined
        });
        setFormVisible(true);
    };

    return (
        <ContentBox>
            <Toast ref={toast} />

            <div style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: '1rem'
                }}>Buscar Horários Disponíveis</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="service-dropdown" style={{ marginBottom: '0.5rem' }}>
                            Escolha o Serviço
                        </label>
                        <Dropdown
                            id="service-dropdown"
                            value={selectedService}
                            options={services}
                            onChange={(e: DropdownChangeEvent) => {
                                const selectedId = e.target.value?.id
                                const selectedService = services.find(s => s.id === selectedId);
                                setSelectedService(selectedService ?? null);
                            }}
                            optionLabel="name"
                            placeholder="Selecione um Serviço"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="professional-dropdown" style={{ marginBottom: '0.5rem' }}>
                            Escolha o Profissional
                        </label>
                        <Dropdown
                            id="professional-dropdown"
                            value={selectedProfessional}
                            options={professionals}
                            onChange={(e) => setSelectedProfessional(e.value)}
                            optionLabel="name"
                            placeholder="Selecione um Profissional"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="professional-dropdown" style={{ marginBottom: '0.5rem' }}>
                            Escolha o Cliente
                        </label>
                        <Dropdown
                            id="professional-dropdown"
                            value={selectedCustomer}
                            options={customer}
                            onChange={(e) => setSelectedCustomer(e.value)}
                            optionLabel="name"
                            placeholder="Selecione um Cliente"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </div>

            {loading ? <p>Buscando horários...</p> : (
                availableSlots.length > 0 && (
                    <div style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        marginBottom: '2rem',
                    }}>
                        <h3 style={{
                            fontWeight: 600,
                            marginBottom: '1rem'
                        }}>Horários Disponíveis:</h3>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                        }}>
                            {availableSlots.map((slot) => (
                                <Button
                                    key={slot.id!}
                                    label={new Date(slot.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    onClick={() => handleBookSlotClick(slot.id!)}
                                    outlined
                                    style={{ padding: '0.25rem' }}
                                />
                            ))}
                        </div>
                    </div>
                )
            )}


            <div style={{ padding: '1.5rem' }}>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '1rem'
                    }}
                >
                    <InputText
                        value={buscaId}
                        onChange={(e) => setBuscaId(e.target.value)}
                        placeholder="Identificador"
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', minWidth: '200px' }}
                    />

                    <Button
                        label="Buscar Agendamento pelo ID"
                        icon="pi pi-search"
                        onClick={buscarPorId}
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                    />

                    <Button
                        label="Novo Agendamento"
                        icon="pi pi-plus"
                        severity="success"
                        onClick={() => abrirEditor()}
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                    />
                </div>

                <div style={{ overflowX: 'auto', marginTop: '5rem' }}>
                    <DataTable
                        value={(slotEncontrado || slots) ?? []}
                        emptyMessage="Nenhum agendamento encontrado"
                        scrollable
                        responsiveLayout="scroll"
                        scrollHeight="flex"
                        tableStyle={{ minWidth: '60rem', borderRadius: '4px' }}
                    >

                        <Column field="description" header="Agendamento" />
                        <Column field="service.name" header="Serviço" />
                        <Column
                            field="date"
                            header="Data"
                            body={(rowData) => {
                                const date = new Date(rowData.date);
                                return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
                            }}
                        />
                        <Column field="customer.name" header="Cliente" />
                        <Column field="professional.name" header="Profissional" />
                        <Column
                            field="status"
                            header="Status"
                            body={(rowData: SlotDTO) => SlotStatusMap[rowData.status!] || 'Indefinido'}
                        />
                        <Column
                            header="Ações"
                            style={{ textAlign: 'center' }}
                            body={(rowData) => (
                                <div className="flex gap-2">
                                    <Button
                                        icon="pi pi-times"
                                        text
                                        rounded
                                        severity="danger"
                                        onClick={() => cancelarSlot(rowData.id)}
                                    />
                                </div>
                            )}
                        />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={'Novo Agendamento'}
                headerStyle={{ padding: '1rem' }}
                visible={formVisible}
                onHide={() => setFormVisible(false)}
                style={{ width: '50%' }}
                footer={
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'flex-end',
                        alignItems: 'flex-end',
                        gap: '0.75rem',
                        margin: '1.5rem',
                    }}>
                        <Button
                            label="Salvar"
                            icon="pi pi-check"
                            severity="success"
                            onClick={criarSlot}
                            style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                        />

                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                            onClick={() => setFormVisible(false)}
                            severity="danger"
                        />
                    </div>
                }
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    margin: '1rem'
                }}>
                    <InputText
                        id="name"
                        value={formData.description}
                        placeholder='Descrição'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <InputMask
                        id="date"
                        mask="99/99/9999"
                        value={formData.dateSlotFormatted ?? ''}
                        placeholder="Data Agendamento"
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => {
                            const formatted = e.value ?? '';

                            if (formatted.length === 10) {
                                const [dia, mes, ano] = formatted.split('/');

                                const paddedDay = dia.padStart(2, '0');
                                const paddedMonth = mes.padStart(2, '0');

                                const isoString = `${ano}-${paddedMonth}-${paddedDay}T00:00:00Z`;
                                const date = new Date(isoString);

                                if (!isNaN(date.getTime())) {
                                    setFormData({
                                        ...formData,
                                        dateSlotFormatted: formatted,
                                        date: date.toISOString()
                                    });
                                } else {
                                    setFormData({
                                        ...formData,
                                        dateSlotFormatted: formatted,
                                        date: ''
                                    });
                                }
                            } else {
                                setFormData({
                                    ...formData,
                                    dateSlotFormatted: formatted,
                                    date: ''
                                });
                            }
                        }}
                    />

                    <InputNumber
                        id="serviceId"
                        value={formData.serviceId}
                        placeholder="Identificador Serviço"
                        maxFractionDigits={2}
                        inputStyle={{
                            fontSize: '0.9rem',
                            padding: '0.4rem 0.75rem',
                            height: 'auto'
                        }}
                        style={{ width: '100%' }}
                        onChange={(e) =>
                            setFormData({ ...formData, serviceId: e.value ?? 0 })
                        }
                    />

                    <InputNumber
                        id="professionalId"
                        value={formData.professionalId}
                        placeholder="Identificador profissional"
                        maxFractionDigits={2}
                        inputStyle={{
                            fontSize: '0.9rem',
                            padding: '0.4rem 0.75rem',
                            height: 'auto'
                        }}
                        style={{ width: '100%' }}
                        onChange={(e) =>
                            setFormData({ ...formData, professionalId: e.value ?? 0 })
                        }
                    />
                    <InputNumber
                        id="customerId"
                        value={formData.customerId}
                        placeholder='Identificador cliente'
                        inputStyle={{
                            fontSize: '0.9rem',
                            padding: '0.4rem 0.75rem',
                            height: 'auto'
                        }}
                        style={{ width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, customerId: e.value ?? 0 })}
                    />
                </div>
            </Dialog>

        </ContentBox >

    );
}