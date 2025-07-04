import { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { CustomerDTO } from '../dtos/CustomerDTO';
import {
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from '../services/CustomerService';
import { ContentBox } from '../styles/section';

export default function CustomerPage() {
    const [clientes, setClientes] = useState<CustomerDTO[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [buscaId, setBuscaId] = useState('');
    const [formData, setFormData] = useState<CustomerDTO>({
        name: '',
        email: '',
        cellphone: ''
    });

    const toast = useRef<Toast>(null);

    const buscarCliente = async () => {
        try {
            const result = await getCustomer(Number(buscaId));
            setClientes([result]);
            toast.current?.show({
                severity: 'info',
                summary: 'Sucesso',
                detail: `ID Cliente: ${result.id} `,
                life: 3000
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Cliente não encontrado',
                life: 3000
            });
        }
    };

    const salvarCliente = async () => {
        try {
            if (formData.id) {
                const atualizado = await updateCustomer(formData.id, formData);
                setClientes((prev) =>
                    prev.map((c) => (c.id === atualizado.id ? atualizado : c))
                );
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Cliente atualizado com sucesso',
                    life: 3000
                });
            } else {
                const criado = await createCustomer(formData);
                setClientes((prev) => [...prev, criado]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Cliente adicionado',
                    life: 3000
                });
            }
            setFormVisible(false);
            setFormData({ name: '', email: '', cellphone: '' });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar cliente',
                life: 3000
            });
        }
    };

    const excluirCliente = async (id: number) => {
        try {
            await deleteCustomer(id);
            setClientes((prev) => prev.filter((c) => c.id !== id));
            toast.current?.show({
                severity: 'warn',
                summary: 'Removido',
                detail: `Cliente ID ${id} foi removido`,
                life: 2500
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao deletar cliente',
                life: 3000
            });
        }
    };

    const abrirEditor = (cliente?: CustomerDTO) => {
        setFormData(cliente ?? { name: '', email: '', cellphone: '' });
        setFormVisible(true);
    };


    return (
        <ContentBox>
            <Toast ref={toast} className="p-5" />

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
                    label="Buscar Cliente pelo ID"
                    icon="pi pi-search"
                    onClick={buscarCliente}
                    style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                />
                <Button
                    label="Novo Cliente"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={() => abrirEditor()}
                    style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}
                />
            </div>

            <DataTable
                value={clientes}
                emptyMessage="Nenhum cliente encontrado"
                scrollable
                responsiveLayout="scroll"
                scrollHeight="flex"
                tableStyle={{ minWidth: '60rem', borderRadius: '4px', marginTop: '5rem' }}
            >
                <Column field="name" header="Nome" />
                <Column field="cellphone" header="Celular" />
                <Column field="email" header="E-mail" />
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
                                onClick={() => excluirCliente(rowData.id!)}
                            />
                        </div>
                    )}
                />
            </DataTable>

            <Dialog
                header={formData.id ? 'Editar Cliente' : 'Novo Cliente'}
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
                            onClick={salvarCliente}
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
                        id="email"
                        value={formData.email}
                        placeholder='Email'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <InputText
                        id="cellphone"
                        value={formData.cellphone}
                        placeholder='Celular'
                        style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', width: '100%' }}
                        onChange={(e) => setFormData({ ...formData, cellphone: e.target.value })}
                    />
                </div>
            </Dialog>
        </ContentBox>
    );
}