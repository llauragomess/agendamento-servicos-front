import { useState, useEffect, useRef } from 'react';
import { SlotDTO, CreateSlotDTO, SlotStatusMap } from '../dtos/SlotDTO';
import {
    getAllSlots,
    getSlotById, cancelSlot, createSlot
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

export default function SlotPage() {
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
        carregarSlots();
    }, []);

    const carregarSlots = async () => {
        try {
            const data = await getAllSlots();
            setSlots(data);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'N�o foi poss�vel carregar os agendamentos', life: 3000 });
        }
    };

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
                                return new Intl.DateTimeFormat('pt-BR').format(date);
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