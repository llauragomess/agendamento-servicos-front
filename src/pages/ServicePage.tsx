import { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ServiceDTO } from '../dtos/ServiceDTO';
import {
    createService, deleteService, getServiceById,
    updateService,
} from '../services/ServiceService';
import { InputNumber } from 'primereact/inputnumber';
import { ContentBox } from '../styles/section';


export default function ServicePage() {
    const [Services, setServices] = useState<ServiceDTO[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [buscaId, setBuscaId] = useState('');
    const [formData, setFormData] = useState<ServiceDTO>({
        name: '',
        description: '',
        durationInMinutes: 0,
        value: 0
    });

    const toast = useRef<Toast>(null);

    const buscarService = async () => {
        try {
            const result = await getServiceById(Number(buscaId));
            setServices([result]);
            toast.current?.show({
                severity: 'info',
                summary: 'Sucesso',
                detail: `ID Serviço: ${result.id} `,
                life: 3000
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Serviço não encontrado',
                life: 3000
            });
        }
    };

    const salvarService = async () => {
        try {
            if (formData.id) {
                const atualizado = await updateService(formData.id, formData);
                setServices((prev) =>
                    prev.map((c) => (c.id === atualizado.id ? atualizado : c))
                );
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Serviço atualizado com sucesso',
                    life: 3000
                });
            } else {
                const criado = await createService(formData);
                setServices((prev) => [...prev, criado]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Serviço adicionado',
                    life: 3000
                });
            }
            setFormVisible(false);
            setFormData({ name: '', description: '', durationInMinutes: 0, value: 0 });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar serviço',
                life: 3000
            });
        }
    };

    const excluirService = async (id: number) => {
        try {
            await deleteService(id);
            setServices((prev) => prev.filter((c) => c.id !== id));
            toast.current?.show({
                severity: 'warn',
                summary: 'Removido',
                detail: `Serviço ID ${id} foi removido`,
                life: 2500
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao deletar serviço',
                life: 3000
            });
        }
    };

    const abrirEditor = (Service?: ServiceDTO) => {
        setFormData(Service ?? { name: '', description: '', durationInMinutes: 0, value: 0 });
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
                        placeholder="Identificador"
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', minWidth: '200px' }}
                        onChange={(e) => setBuscaId(e.target.value)}
                    />
                    <Button
                        label="Buscar Serviço pelo ID"
                        icon="pi pi-search"
                        onClick={buscarService}
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                    />
                    <Button
                        label="Novo Serviço"
                        icon="pi pi-plus"
                        severity="success"
                        onClick={() => abrirEditor()}
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                    />
                </div>

                <div style={{ overflowX: 'auto', marginTop: '5rem' }}>
                    <DataTable
                        value={Services}
                        emptyMessage="Nenhum serviço encontrado"
                        scrollable
                        responsiveLayout="scroll"
                        scrollHeight="flex"
                        tableStyle={{ minWidth: '60rem', borderRadius: '4px' }}
                    >
                        <Column field="name" header="Nome" />
                        <Column field="description" header="Descrição" />
                        <Column field="durationInMinutes" header="Duração" />
                        <Column field="value" header="Valor" dataType='number' />
                        <Column
                            header="Ações"
                            style={{ textAlign: 'center' }}
                            body={(rowData) => (
                                <div className="flex gap-2">
                                    <Button
                                        icon="pi pi-pencil"
                                        text
                                        rounded
                                        severity="info"
                                        onClick={() => abrirEditor(rowData)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        text
                                        rounded
                                        severity="danger"
                                        onClick={() => excluirService(rowData.id!)}
                                    />
                                </div>
                            )}
                        />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={formData.id ? 'Editar Serviço' : 'Novo Serviço'}
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
                            style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                            onClick={salvarService}
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
                        value={formData.name}
                        placeholder='Nome'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <InputText
                        id="description"
                        value={formData.description}
                        placeholder='Descrição'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <InputNumber
                        id="durationInMinutes"
                        value={formData.durationInMinutes}
                        placeholder='Duração'
                        inputStyle={{
                            fontSize: '0.9rem',
                            padding: '0.4rem 0.75rem',
                            height: 'auto'
                        }}
                        style={{ width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, durationInMinutes: e.value ?? 0 })}
                    />

                    <InputNumber
                        id="value"
                        value={formData.value}
                        placeholder="Valor"
                        maxFractionDigits={2}
                        inputStyle={{
                            fontSize: '0.9rem',
                            padding: '0.4rem 0.75rem',
                            height: 'auto'
                        }}
                        style={{ width: '100%' }}
                        onChange={(e) =>
                            setFormData({ ...formData, value: e.value ?? 0 })
                        }
                    />

                </div>
            </Dialog>
        </ContentBox>


    );
}