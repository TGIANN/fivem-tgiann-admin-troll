class MenuOpenedAdminList {
  admins: number[] = [];

  isAddedAdmin(src: number): boolean {
    return this.admins.includes(src);
  }

  addAdmin(src: number) {
    if (this.isAddedAdmin(src)) return;
    this.admins.push(src);
  }

  removeAdmin(src: number) {
    if (!this.isAddedAdmin(src)) return;
    this.admins = this.admins.filter((admin) => admin !== src);
  }

  emitNetToAdmins(eventName: string, ...args: any[]) {
    this.admins.map((admin) => emitNet(eventName, admin, ...args));
  }
}

const global = new MenuOpenedAdminList();

export default global;
